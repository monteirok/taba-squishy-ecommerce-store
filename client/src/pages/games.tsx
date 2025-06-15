import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SquishyClicker } from "@/components/games/squishy-clicker";
import { RewardsPanel } from "@/components/games/rewards-panel";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  Gamepad2, 
  Trophy, 
  Star, 
  Gift,
  Target,
  Award,
  Zap
} from "lucide-react";
import type { UserProfile, GameScore } from "@shared/game-schema";

export default function Games() {
  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/game/profile"],
  });

  const { data: leaderboard = [] } = useQuery<GameScore[]>({
    queryKey: ["/api/game/leaderboard/squishy-clicker"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Squishy Games
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Play fun mini-games, earn points, and redeem amazing rewards! 
            The more you play, the more points you earn.
          </p>
        </div>

        {/* Player Stats Card */}
        {profile && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Your Gaming Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {profile.totalPoints}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Points
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    Level {profile.level}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current Level
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {profile.gamesPlayed}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Games Played
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {profile.highScore}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Best Score
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="play" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="play" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Play Games
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Rewards
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="play" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Game Card */}
                <div className="lg:col-span-2">
                  <SquishyClicker />
                </div>
              </div>

              {/* How to Play */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    How to Play & Earn Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg">Squishy Clicker</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Click the squishy as fast as you can</li>
                        <li>• Build combos for bonus points</li>
                        <li>• Higher combos = higher multipliers</li>
                        <li>• You have 30 seconds per game</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg">Point System</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Base: 1 point per 10 score</li>
                        <li>• Combo bonus: 1 point per 5 max combo</li>
                        <li>• Use points to redeem rewards</li>
                        <li>• Level up as you earn more points</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <RewardsPanel />
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Squishy Clicker Leaderboard
                  </CardTitle>
                  <CardDescription>
                    Top players and their best scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {leaderboard.length > 0 ? (
                    <div className="space-y-2">
                      {leaderboard.slice(0, 10).map((score, index) => (
                        <div
                          key={score.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">
                                Player {score.sessionId.slice(-6)}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(score.playedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-600">
                              {score.score}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              +{score.pointsEarned} pts
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
                        No scores yet
                      </div>
                      <div className="text-sm text-gray-500">
                        Be the first to set a high score!
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}