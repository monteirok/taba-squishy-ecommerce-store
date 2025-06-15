import { pgTable, serial, varchar, text, decimal, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sales table - from the SALES sheet
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  customer: varchar("customer", { length: 100 }).notNull(),
  item: varchar("item", { length: 100 }).notNull(),
  qty: integer("qty").notNull(),
  pricePaid: decimal("price_paid", { precision: 10, scale: 2 }).notNull(),
  pickupDate: varchar("pickup_date", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reservations table - from the RESERVATIONS sheet  
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  customer: varchar("customer", { length: 100 }).notNull(),
  item: varchar("item", { length: 100 }).notNull(),
  pricePaid: decimal("price_paid", { precision: 10, scale: 2 }).notNull(),
  qty: integer("qty").notNull(),
  dateSold: varchar("date_sold", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory table - from the INVENTORY sheet
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  order: varchar("order", { length: 50 }),
  type: varchar("type", { length: 50 }),
  item: varchar("item", { length: 100 }).notNull(),
  retailPrice: decimal("retail_price", { precision: 10, scale: 2 }).notNull(),
  resellPrice: decimal("resell_price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  status: varchar("status", { length: 50 }).notNull().default("Available"),
  track: varchar("track", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin users table for authentication
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

// Types
export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type InventoryItem = typeof inventory.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventorySchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

// Admin login schema
export const adminLoginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;