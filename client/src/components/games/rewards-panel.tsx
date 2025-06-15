import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedNotification } from "@/components/ui/animated-notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Gift, Star, Trophy, Percent, Tag, Award, Coins } from "lucide-react";
import type { GameReward, UserRewardWithDetails, UserProfile } from "@shared/game-schema";

export function RewardsPanel() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");

  const queryClient = useQueryClient();

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/game/profile"],
  });

  const { data: availableRewards = [] } = useQuery<GameReward[]>({
    queryKey: ["/api/game/rewards"],
  });

  const { data: userRewards = [] } = useQuery<UserRewardWithDetails[]>({
    queryKey: ["/api/game/user-rewards"],
  });

  const redeemRewardMutation = useMutation({
    mutationFn: (rewardId: number) =>
      apiRequest(`/api/game/rewards/${rewardId}/redeem`, "POST"),
    onSuccess: (data, rewardId) => {
      const reward = availableRewards.find(r => r.id === rewardId);
      setNotificationMessage(`Successfully redeemed ${reward?.name}!`);
      setNotificationType("success");
      setShowNotification(true);
      
      queryClient.invalidateQueries({ queryKey: ["/api/game/user-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/game/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/game/rewards"] });
    },
    onError: () => {
      setNotificationMessage("Failed to redeem reward. Not enough points or already at limit.");
      setNotificationType("error");
      setShowNotification(true);
    },
  });

  const handleRedeemReward = (rewardId: number) => {
    redeemRewardMutation.mutate(rewardId);
  };

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case "discount":
        return <Percent className="w-5 h-5" />;
      case "product":
        return <Gift className="w-5 h-5" />;
      case "badge":
        return <Award className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getRewardColor = (rewardType: string) => {
    switch (rewardType) {
      case "discount":
        return "bg-green-500";
      case "product":
        return "bg-blue-500";
      case "badge":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const canAffordReward = (reward: GameReward) => {
    return profile && profile.totalPoints >= reward.pointsCost;
  };

  const isRewardAvailable = (reward: GameReward) => {
    return reward.isActive && 
           (!reward.maxRedemptions || reward.currentRedemptions < reward.maxRedemptions);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Player Points Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-500" />
            Your Game Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-600">
                {profile?.totalPoints || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Available Points
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">
                Level {profile?.level || 1}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {profile?.gamesPlayed || 0} games played
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Rewards</TabsTrigger>
          <TabsTrigger value="claimed">My Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${getRewardColor(reward.rewardType)} text-white`}>
                      {getRewardIcon(reward.rewardType)}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {reward.rewardType}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {reward.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{reward.pointsCost}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">points</span>
                    </div>
                    {reward.maxRedemptions && (
                      <div className="text-xs text-gray-500">
                        {reward.currentRedemptions}/{reward.maxRedemptions} claimed
                      </div>
                    )}
                  </div>

                  {reward.rewardValue && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Value: </span>
                      <span className="font-medium">
                        {reward.rewardType === "discount" ? `${reward.rewardValue}% off` : reward.rewardValue}
                      </span>
                    </div>
                  )}

                  <AnimatedButton
                    onClick={() => handleRedeemReward(reward.id)}
                    disabled={
                      !canAffordReward(reward) || 
                      !isRewardAvailable(reward) || 
                      redeemRewardMutation.isPending
                    }
                    animationType="scale"
                    size="sm"
                    className="w-full"
                    variant={canAffordReward(reward) ? "default" : "secondary"}
                  >
                    {!canAffordReward(reward) 
                      ? "Not Enough Points" 
                      : !isRewardAvailable(reward)
                      ? "Unavailable"
                      : "Redeem"
                    }
                  </AnimatedButton>
                </CardContent>

                {!isRewardAvailable(reward) && (
                  <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                    <Badge variant="secondary">Sold Out</Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {availableRewards.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  No rewards available at the moment
                </div>
                <div className="text-sm text-gray-500">
                  Check back later for new rewards!
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="claimed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userRewards.map((userReward) => (
              <Card key={userReward.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${getRewardColor(userReward.reward.rewardType)} text-white`}>
                      {getRewardIcon(userReward.reward.rewardType)}
                    </div>
                    <Badge variant={userReward.isUsed ? "secondary" : "default"}>
                      {userReward.isUsed ? "Used" : "Available"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{userReward.reward.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {userReward.reward.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  {userReward.reward.rewardValue && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Value: </span>
                      <span className="font-medium">
                        {userReward.reward.rewardType === "discount" 
                          ? `${userReward.reward.rewardValue}% off` 
                          : userReward.reward.rewardValue}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Redeemed: {new Date(userReward.redeemedAt).toLocaleDateString()}
                  </div>
                  
                  {userReward.usedAt && (
                    <div className="text-xs text-gray-500">
                      Used: {new Date(userReward.usedAt).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {userRewards.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  No rewards claimed yet
                </div>
                <div className="text-sm text-gray-500">
                  Play games to earn points and redeem rewards!
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AnimatedNotification
        type={notificationType}
        title={notificationType === "success" ? "Reward Redeemed!" : "Redemption Failed"}
        message={notificationMessage}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        autoClose={true}
        duration={4000}
      />
    </div>
  );
}