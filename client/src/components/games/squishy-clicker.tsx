import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedNotification } from "@/components/ui/animated-notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Star, Trophy, Zap } from "lucide-react";
import type { UserProfile, GameScore } from "@shared/game-schema";

interface SquishyClickerProps {
  onGameComplete?: (score: number, points: number) => void;
}

export function SquishyClicker({ onGameComplete }: SquishyClickerProps) {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [clicks, setClicks] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [gameResults, setGameResults] = useState<{ score: number; points: number } | null>(null);

  const queryClient = useQueryClient();

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/game/profile"],
  });

  const submitScoreMutation = useMutation({
    mutationFn: (data: { gameType: string; score: number; pointsEarned: number; duration: number }) =>
      apiRequest("/api/game/score", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/game/scores"] });
    },
  });

  const startGame = useCallback(() => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setMaxCombo(0);
    setClicks([]);
    setGameResults(null);
  }, []);

  const endGame = useCallback(async () => {
    setGameActive(false);
    const pointsEarned = Math.floor(score / 10) + Math.floor(maxCombo / 5);
    
    try {
      await submitScoreMutation.mutateAsync({
        gameType: "squishy-clicker",
        score,
        pointsEarned,
        duration: 30 - timeLeft,
      });
      
      setGameResults({ score, points: pointsEarned });
      setNotificationMessage(`Game Over! Score: ${score}, Points Earned: ${pointsEarned}`);
      setShowNotification(true);
      
      onGameComplete?.(score, pointsEarned);
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  }, [score, maxCombo, timeLeft, submitScoreMutation, onGameComplete]);

  const handleSquishyClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!gameActive) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const clickId = Date.now() + Math.random();
    setClicks(prev => [...prev, { id: clickId, x, y }]);
    
    setTimeout(() => {
      setClicks(prev => prev.filter(click => click.id !== clickId));
    }, 800);
    
    setScore(prev => prev + (1 + Math.floor(combo / 5)));
    setCombo(prev => {
      const newCombo = prev + 1;
      setMaxCombo(current => Math.max(current, newCombo));
      return newCombo;
    });
    
    setTimeout(() => {
      setCombo(prev => Math.max(0, prev - 1));
    }, 1000);
  }, [gameActive, combo]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameActive && timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft, endGame]);

  const comboMultiplier = 1 + Math.floor(combo / 5);
  const progress = ((30 - timeLeft) / 30) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-pink-500" />
          Squishy Clicker
        </CardTitle>
        <CardDescription>
          Click the squishy as fast as you can! Build combos for bonus points.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{timeLeft}s</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">x{comboMultiplier}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Multiplier</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{combo}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Combo</div>
          </div>
        </div>

        {/* Progress Bar */}
        {gameActive && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Game Progress</span>
              <span>{30 - timeLeft}/30s</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Game Area */}
        <div className="relative">
          {!gameActive ? (
            <div className="text-center py-12 space-y-4">
              {gameResults ? (
                <div className="space-y-4">
                  <div className="text-6xl">🎉</div>
                  <div>
                    <div className="text-2xl font-bold">Game Complete!</div>
                    <div className="text-lg text-gray-600 dark:text-gray-400">
                      Final Score: {gameResults.score}
                    </div>
                    <div className="text-lg text-green-600">
                      Points Earned: {gameResults.points}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    <Trophy className="w-4 h-4 mr-2" />
                    Max Combo: {maxCombo}
                  </Badge>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl">🧸</div>
                  <div>
                    <div className="text-xl font-semibold">Ready to Play?</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Click as many squishies as possible in 30 seconds!
                    </div>
                  </div>
                </div>
              )}
              
              <AnimatedButton
                onClick={startGame}
                animationType="bounce"
                size="lg"
                className="bg-pink-500 hover:bg-pink-600 text-white"
                disabled={submitScoreMutation.isPending}
              >
                <Zap className="w-5 h-5 mr-2" />
                {gameResults ? "Play Again" : "Start Game"}
              </AnimatedButton>
            </div>
          ) : (
            <div 
              className="relative h-80 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg cursor-pointer border-4 border-dashed border-pink-300 dark:border-pink-700 hover:border-pink-400 dark:hover:border-pink-600 transition-colors"
              onClick={handleSquishyClick}
            >
              {/* Animated Squishy */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl hover:scale-110 transition-transform duration-150 select-none">
                  🧸
                </div>
              </div>
              
              {/* Click Effects */}
              {clicks.map(click => (
                <div
                  key={click.id}
                  className="absolute pointer-events-none"
                  style={{ left: click.x, top: click.y }}
                >
                  <div className="animate-ping text-2xl font-bold text-pink-600">
                    +{comboMultiplier}
                  </div>
                </div>
              ))}
              
              {/* Combo Indicator */}
              {combo > 4 && (
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="bg-orange-500 text-white animate-pulse">
                    <Star className="w-4 h-4 mr-1" />
                    {combo} Combo!
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Player Stats */}
        {profile && (
          <div className="text-center pt-4 border-t">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your Game Stats
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <div>
                <span className="font-semibold text-blue-600">{profile.totalPoints}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Total Points</span>
              </div>
              <div>
                <span className="font-semibold text-green-600">Level {profile.level}</span>
              </div>
              <div>
                <span className="font-semibold text-purple-600">{profile.gamesPlayed}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Games Played</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <AnimatedNotification
        type="success"
        title="Game Complete!"
        message={notificationMessage}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        autoClose={true}
        duration={4000}
      />
    </Card>
  );
}