import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameStorage } from "./game-storage";
import { adminStorage } from "./admin-storage";
import { insertCartItemSchema, insertWishlistItemSchema } from "@shared/schema";
import { insertUserProfileSchema, insertGameScoreSchema } from "@shared/game-schema";
import { 
  insertSaleSchema, 
  insertReservationSchema, 
  insertInventorySchema,
  adminLoginSchema
} from "@shared/admin-schema";
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

  // === WISHLIST API ROUTES ===

  // Get wishlist items
  app.get("/api/wishlist", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      const wishlistItems = await storage.getWishlistItems(sessionId);
      res.json(wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      res.status(500).json({ message: "Failed to fetch wishlist items" });
    }
  });

  // Add item to wishlist
  app.post("/api/wishlist", async (req, res) => {
    try {
      const sessionId = (req as any).sessionID || "default-session";
      const wishlistItemData = insertWishlistItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const wishlistItem = await storage.addToWishlist(wishlistItemData);
      res.status(201).json(wishlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid wishlist item data", 
          errors: error.errors 
        });
      }
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Failed to add item to wishlist" });
    }
  });

  // Remove item from wishlist
  app.delete("/api/wishlist/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId) || productId < 1) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const sessionId = (req as any).sessionID || "default-session";
      const removed = await storage.removeFromWishlist(sessionId, productId);
      
      if (!removed) {
        return res.status(404).json({ message: "Item not found in wishlist" });
      }
      
      res.json({ message: "Item removed from wishlist" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove item from wishlist" });
    }
  });

  // Check if item is in wishlist
  app.get("/api/wishlist/check/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId) || productId < 1) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const sessionId = (req as any).sessionID || "default-session";
      const isInWishlist = await storage.isInWishlist(sessionId, productId);
      
      res.json({ isInWishlist });
    } catch (error) {
      console.error("Error checking wishlist:", error);
      res.status(500).json({ message: "Failed to check wishlist" });
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

  // === ADMIN API ROUTES ===

  // Admin login page redirect - redirect to frontend admin page
  app.get("/api/admin/login", (req, res) => {
    res.redirect("/admin");
  });

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const loginData = adminLoginSchema.parse(req.body);
      
      const isValid = await adminStorage.validateAdminPassword(loginData.username, loginData.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      await adminStorage.updateLastLogin(loginData.username);
      const user = await adminStorage.getAdminUser(loginData.username);
      
      // In a production app, you'd set up proper session management here
      res.json({ 
        message: "Login successful", 
        user: { 
          id: user?.id, 
          username: user?.username, 
          email: user?.email, 
          role: user?.role 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      console.error("Error during admin login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Sales endpoints
  app.get("/api/admin/sales", async (req, res) => {
    try {
      const query = req.query.search as string;
      const sales = query 
        ? await adminStorage.searchSales(query)
        : await adminStorage.getSales();
      res.json(sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      res.status(500).json({ message: "Failed to fetch sales" });
    }
  });

  app.get("/api/admin/sales/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid sale ID" });
      }
      
      const sale = await adminStorage.getSale(id);
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      
      res.json(sale);
    } catch (error) {
      console.error("Error fetching sale:", error);
      res.status(500).json({ message: "Failed to fetch sale" });
    }
  });

  app.post("/api/admin/sales", async (req, res) => {
    try {
      const saleData = insertSaleSchema.parse(req.body);
      const sale = await adminStorage.createSale(saleData);
      res.status(201).json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sale data", errors: error.errors });
      }
      console.error("Error creating sale:", error);
      res.status(500).json({ message: "Failed to create sale" });
    }
  });

  app.patch("/api/admin/sales/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid sale ID" });
      }
      
      const sale = await adminStorage.updateSale(id, req.body);
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      
      res.json(sale);
    } catch (error) {
      console.error("Error updating sale:", error);
      res.status(500).json({ message: "Failed to update sale" });
    }
  });

  app.delete("/api/admin/sales/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid sale ID" });
      }
      
      const deleted = await adminStorage.deleteSale(id);
      if (!deleted) {
        return res.status(404).json({ message: "Sale not found" });
      }
      
      res.json({ message: "Sale deleted successfully" });
    } catch (error) {
      console.error("Error deleting sale:", error);
      res.status(500).json({ message: "Failed to delete sale" });
    }
  });

  // Reservations endpoints
  app.get("/api/admin/reservations", async (req, res) => {
    try {
      const query = req.query.search as string;
      const reservations = query 
        ? await adminStorage.searchReservations(query)
        : await adminStorage.getReservations();
      res.json(reservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  app.get("/api/admin/reservations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reservation ID" });
      }
      
      const reservation = await adminStorage.getReservation(id);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      res.json(reservation);
    } catch (error) {
      console.error("Error fetching reservation:", error);
      res.status(500).json({ message: "Failed to fetch reservation" });
    }
  });

  app.post("/api/admin/reservations", async (req, res) => {
    try {
      const reservationData = insertReservationSchema.parse(req.body);
      const reservation = await adminStorage.createReservation(reservationData);
      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reservation data", errors: error.errors });
      }
      console.error("Error creating reservation:", error);
      res.status(500).json({ message: "Failed to create reservation" });
    }
  });

  app.patch("/api/admin/reservations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reservation ID" });
      }
      
      const reservation = await adminStorage.updateReservation(id, req.body);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      res.json(reservation);
    } catch (error) {
      console.error("Error updating reservation:", error);
      res.status(500).json({ message: "Failed to update reservation" });
    }
  });

  app.delete("/api/admin/reservations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reservation ID" });
      }
      
      const deleted = await adminStorage.deleteReservation(id);
      if (!deleted) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      res.json({ message: "Reservation deleted successfully" });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      res.status(500).json({ message: "Failed to delete reservation" });
    }
  });

  // Inventory endpoints
  app.get("/api/admin/inventory", async (req, res) => {
    try {
      const query = req.query.search as string;
      const inventory = query 
        ? await adminStorage.searchInventory(query)
        : await adminStorage.getInventory();
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.get("/api/admin/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inventory item ID" });
      }
      
      const item = await adminStorage.getInventoryItem(id);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });

  app.post("/api/admin/inventory", async (req, res) => {
    try {
      const itemData = insertInventorySchema.parse(req.body);
      const item = await adminStorage.createInventoryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory data", errors: error.errors });
      }
      console.error("Error creating inventory item:", error);
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  app.patch("/api/admin/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inventory item ID" });
      }
      
      const item = await adminStorage.updateInventoryItem(id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Error updating inventory item:", error);
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });

  app.delete("/api/admin/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid inventory item ID" });
      }
      
      const deleted = await adminStorage.deleteInventoryItem(id);
      if (!deleted) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json({ message: "Inventory item deleted successfully" });
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
