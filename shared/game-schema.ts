import { pgTable, serial, varchar, integer, boolean, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  username: varchar("username", { length: 50 }),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  gamesPlayed: integer("games_played").default(0),
  highScore: integer("high_score").default(0),
  lastPlayedAt: timestamp("last_played_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameRewards = pgTable("game_rewards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  pointsCost: integer("points_cost").notNull(),
  rewardType: varchar("reward_type", { length: 50 }).notNull(), // 'discount', 'product', 'badge'
  rewardValue: varchar("reward_value", { length: 255 }), // discount percentage, product ID, or badge name
  isActive: boolean("is_active").default(true),
  maxRedemptions: integer("max_redemptions"),
  currentRedemptions: integer("current_redemptions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  rewardId: integer("reward_id").references(() => gameRewards.id),
  redeemedAt: timestamp("redeemed_at").defaultNow(),
  isUsed: boolean("is_used").default(false),
  usedAt: timestamp("used_at"),
});

export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  gameType: varchar("game_type", { length: 50 }).notNull(),
  score: integer("score").notNull(),
  pointsEarned: integer("points_earned").notNull(),
  duration: integer("duration"), // in seconds
  playedAt: timestamp("played_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertGameRewardSchema = createInsertSchema(gameRewards).omit({
  id: true,
  createdAt: true,
  currentRedemptions: true,
});

export const insertUserRewardSchema = createInsertSchema(userRewards).omit({
  id: true,
  redeemedAt: true,
});

export const insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
  playedAt: true,
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type GameReward = typeof gameRewards.$inferSelect;
export type InsertGameReward = z.infer<typeof insertGameRewardSchema>;
export type UserReward = typeof userRewards.$inferSelect;
export type InsertUserReward = z.infer<typeof insertUserRewardSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;

export type UserRewardWithDetails = UserReward & {
  reward: GameReward;
};