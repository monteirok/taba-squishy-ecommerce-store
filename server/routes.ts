import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameStorage } from "./game-storage";
import { insertCartItemSchema } from "@shared/schema";
import { insertUserProfileSchema, insertGameScoreSchema } from "@shared/game-schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get featured products
  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Search products
  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      // Input validation and sanitization
      if (typeof query !== 'string' || query.length > 100) {
        return res.status(400).json({ message: "Invalid search query" });
      }

      // Rate limiting could be added here in production
      const sanitizedQuery = query.trim();
      if (sanitizedQuery.length < 1) {
        return res.status(400).json({ message: "Search query too short" });
      }
      
      const products = await storage.searchProducts(sanitizedQuery);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      
      // Validate category parameter
      if (!category || typeof category !== 'string' || category.length > 50) {
        return res.status(400).json({ message: "Invalid category" });
      }

      // Whitelist allowed categories
      const allowedCategories = ['all', 'kawaii', 'stress-relief', 'fidget', 'food', 'therapy', 'sets'];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ message: "Category not found" });
      }

      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id) || id < 1 || id > 999999) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get cart items
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  // Add item to cart
  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        sessionId,
      });
      
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      console.error("Error adding item to cart:", error);
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  // Update cart item quantity
  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (isNaN(id) || id < 1 || typeof quantity !== "number" || quantity < 0 || quantity > 100) {
        return res.status(400).json({ message: "Invalid input" });
      }
      
      if (quantity === 0) {
        const removed = await storage.removeFromCart(id);
        if (!removed) {
          return res.status(404).json({ message: "Cart item not found" });
        }
        return res.json({ message: "Item removed from cart" });
      }
      
      const updatedItem = await storage.updateCartItemQuantity(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  // Remove item from cart
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id) || id < 1) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }
      
      const removed = await storage.removeFromCart(id);
      if (!removed) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Clear cart
  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      await storage.clearCart(sessionId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // === GAME API ROUTES ===

  // Get or create user profile
  app.get("/api/game/profile", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      let profile = await gameStorage.getUserProfile(sessionId);
      
      if (!profile) {
        profile = await gameStorage.createUserProfile({ sessionId });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Update user profile
  app.patch("/api/game/profile", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      const updates = req.body;
      
      // Validate updates
      if (typeof updates !== 'object' || updates === null) {
        return res.status(400).json({ message: "Invalid update data" });
      }
      
      const profile = await gameStorage.updateUserProfile(sessionId, updates);
      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Submit game score
  app.post("/api/game/score", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      const scoreData = insertGameScoreSchema.parse({
        ...req.body,
        sessionId,
      });
      
      const score = await gameStorage.addGameScore(scoreData);
      
      // Add points to user profile
      await gameStorage.addPoints(sessionId, scoreData.pointsEarned);
      
      res.status(201).json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid score data", errors: error.errors });
      }
      console.error("Error submitting game score:", error);
      res.status(500).json({ message: "Failed to submit game score" });
    }
  });

  // Get user high scores
  app.get("/api/game/scores", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      const gameType = req.query.gameType as string;
      
      const scores = await gameStorage.getUserHighScores(sessionId, gameType);
      res.json(scores);
    } catch (error) {
      console.error("Error fetching user scores:", error);
      res.status(500).json({ message: "Failed to fetch user scores" });
    }
  });

  // Get leaderboard
  app.get("/api/game/leaderboard/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!gameType || gameType.length > 50) {
        return res.status(400).json({ message: "Invalid game type" });
      }
      
      if (limit < 1 || limit > 100) {
        return res.status(400).json({ message: "Invalid limit" });
      }
      
      const leaderboard = await gameStorage.getLeaderboard(gameType, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Get available rewards
  app.get("/api/game/rewards", async (req, res) => {
    try {
      const rewards = await gameStorage.getAvailableRewards();
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      res.status(500).json({ message: "Failed to fetch rewards" });
    }
  });

  // Redeem reward
  app.post("/api/game/rewards/:id/redeem", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      const rewardId = parseInt(req.params.id);
      
      if (isNaN(rewardId) || rewardId < 1) {
        return res.status(400).json({ message: "Invalid reward ID" });
      }
      
      const userReward = await gameStorage.redeemReward(sessionId, rewardId);
      if (!userReward) {
        return res.status(400).json({ message: "Unable to redeem reward" });
      }
      
      res.status(201).json(userReward);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      res.status(500).json({ message: "Failed to redeem reward" });
    }
  });

  // Get user rewards
  app.get("/api/game/user-rewards", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      const userRewards = await gameStorage.getUserRewards(sessionId);
      res.json(userRewards);
    } catch (error) {
      console.error("Error fetching user rewards:", error);
      res.status(500).json({ message: "Failed to fetch user rewards" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
