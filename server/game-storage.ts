import type { 
  UserProfile, 
  InsertUserProfile, 
  GameReward, 
  InsertGameReward,
  UserReward,
  InsertUserReward,
  GameScore,
  InsertGameScore,
  UserRewardWithDetails
} from "@shared/game-schema";

export interface IGameStorage {
  // User Profile operations
  getUserProfile(sessionId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(sessionId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined>;
  
  // Game Score operations
  addGameScore(score: InsertGameScore): Promise<GameScore>;
  getUserHighScores(sessionId: string, gameType?: string): Promise<GameScore[]>;
  getLeaderboard(gameType: string, limit?: number): Promise<GameScore[]>;
  
  // Reward operations
  getAvailableRewards(): Promise<GameReward[]>;
  redeemReward(sessionId: string, rewardId: number): Promise<UserReward | undefined>;
  getUserRewards(sessionId: string): Promise<UserRewardWithDetails[]>;
  
  // Points operations
  addPoints(sessionId: string, points: number): Promise<UserProfile | undefined>;
}

export class MemGameStorage implements IGameStorage {
  private userProfiles: Map<string, UserProfile>;
  private gameRewards: Map<number, GameReward>;
  private userRewards: Map<number, UserReward>;
  private gameScores: Map<number, GameScore>;
  private currentProfileId: number;
  private currentRewardId: number;
  private currentUserRewardId: number;
  private currentScoreId: number;

  constructor() {
    this.userProfiles = new Map();
    this.gameRewards = new Map();
    this.userRewards = new Map();
    this.gameScores = new Map();
    this.currentProfileId = 1;
    this.currentRewardId = 1;
    this.currentUserRewardId = 1;
    this.currentScoreId = 1;
    
    this.seedRewards();
  }

  private seedRewards() {
    const rewards: GameReward[] = [
      {
        id: 1,
        name: "5% Discount",
        description: "Get 5% off your next purchase",
        pointsCost: 100,
        rewardType: "discount",
        rewardValue: "5",
        isActive: true,
        maxRedemptions: null,
        currentRedemptions: 0,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "10% Discount",
        description: "Get 10% off your next purchase",
        pointsCost: 250,
        rewardType: "discount",
        rewardValue: "10",
        isActive: true,
        maxRedemptions: null,
        currentRedemptions: 0,
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Free Shipping",
        description: "Free shipping on your next order",
        pointsCost: 150,
        rewardType: "discount",
        rewardValue: "free_shipping",
        isActive: true,
        maxRedemptions: null,
        currentRedemptions: 0,
        createdAt: new Date(),
      },
      {
        id: 4,
        name: "Kawaii Champion Badge",
        description: "Exclusive kawaii champion badge for your profile",
        pointsCost: 500,
        rewardType: "badge",
        rewardValue: "kawaii_champion",
        isActive: true,
        maxRedemptions: null,
        currentRedemptions: 0,
        createdAt: new Date(),
      },
      {
        id: 5,
        name: "20% Mega Discount",
        description: "Massive 20% discount for dedicated players",
        pointsCost: 1000,
        rewardType: "discount",
        rewardValue: "20",
        isActive: true,
        maxRedemptions: 10,
        currentRedemptions: 0,
        createdAt: new Date(),
      }
    ];

    rewards.forEach(reward => {
      this.gameRewards.set(reward.id, reward);
    });
    this.currentRewardId = rewards.length + 1;
  }

  async getUserProfile(sessionId: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(sessionId);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const profile: UserProfile = {
      id: this.currentProfileId++,
      ...insertProfile,
      totalPoints: insertProfile.totalPoints || 0,
      level: insertProfile.level || 1,
      gamesPlayed: insertProfile.gamesPlayed || 0,
      highScore: insertProfile.highScore || 0,
      lastPlayedAt: insertProfile.lastPlayedAt || null,
      createdAt: new Date(),
    };

    this.userProfiles.set(profile.sessionId, profile);
    return profile;
  }

  async updateUserProfile(sessionId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const existing = this.userProfiles.get(sessionId);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.userProfiles.set(sessionId, updated);
    return updated;
  }

  async addGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const score: GameScore = {
      id: this.currentScoreId++,
      ...insertScore,
      playedAt: new Date(),
    };

    this.gameScores.set(score.id, score);

    // Update user profile stats
    const profile = await this.getUserProfile(insertScore.sessionId);
    if (profile) {
      const updates: Partial<UserProfile> = {
        gamesPlayed: profile.gamesPlayed + 1,
        highScore: Math.max(profile.highScore, insertScore.score),
        lastPlayedAt: new Date(),
        totalPoints: profile.totalPoints + insertScore.pointsEarned,
      };

      // Level up system
      const newLevel = Math.floor((profile.totalPoints + insertScore.pointsEarned) / 500) + 1;
      if (newLevel > profile.level) {
        updates.level = newLevel;
      }

      await this.updateUserProfile(insertScore.sessionId, updates);
    }

    return score;
  }

  async getUserHighScores(sessionId: string, gameType?: string): Promise<GameScore[]> {
    const scores = Array.from(this.gameScores.values())
      .filter(score => {
        if (score.sessionId !== sessionId) return false;
        if (gameType && score.gameType !== gameType) return false;
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return scores;
  }

  async getLeaderboard(gameType: string, limit = 10): Promise<GameScore[]> {
    const scores = Array.from(this.gameScores.values())
      .filter(score => score.gameType === gameType)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scores;
  }

  async getAvailableRewards(): Promise<GameReward[]> {
    return Array.from(this.gameRewards.values())
      .filter(reward => {
        if (!reward.isActive) return false;
        if (reward.maxRedemptions && reward.currentRedemptions >= reward.maxRedemptions) return false;
        return true;
      })
      .sort((a, b) => a.pointsCost - b.pointsCost);
  }

  async redeemReward(sessionId: string, rewardId: number): Promise<UserReward | undefined> {
    const reward = this.gameRewards.get(rewardId);
    const profile = await this.getUserProfile(sessionId);

    if (!reward || !profile) return undefined;
    if (!reward.isActive) return undefined;
    if (reward.maxRedemptions && reward.currentRedemptions >= reward.maxRedemptions) return undefined;
    if (profile.totalPoints < reward.pointsCost) return undefined;

    // Deduct points
    await this.updateUserProfile(sessionId, {
      totalPoints: profile.totalPoints - reward.pointsCost
    });

    // Update reward redemption count
    reward.currentRedemptions += 1;
    this.gameRewards.set(rewardId, reward);

    // Create user reward
    const userReward: UserReward = {
      id: this.currentUserRewardId++,
      sessionId,
      rewardId,
      redeemedAt: new Date(),
      isUsed: false,
      usedAt: null,
    };

    this.userRewards.set(userReward.id, userReward);
    return userReward;
  }

  async getUserRewards(sessionId: string): Promise<UserRewardWithDetails[]> {
    const userRewards = Array.from(this.userRewards.values())
      .filter(ur => ur.sessionId === sessionId)
      .sort((a, b) => b.redeemedAt.getTime() - a.redeemedAt.getTime());

    return userRewards.map(ur => ({
      ...ur,
      reward: this.gameRewards.get(ur.rewardId!)!
    })).filter(ur => ur.reward);
  }

  async addPoints(sessionId: string, points: number): Promise<UserProfile | undefined> {
    const profile = await this.getUserProfile(sessionId);
    if (!profile) return undefined;

    return this.updateUserProfile(sessionId, {
      totalPoints: profile.totalPoints + points
    });
  }
}

export const gameStorage = new MemGameStorage();