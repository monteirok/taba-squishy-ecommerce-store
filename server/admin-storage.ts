import type { 
  Sale, 
  InsertSale, 
  Reservation, 
  InsertReservation, 
  InventoryItem, 
  InsertInventoryItem,
  AdminUser,
  InsertAdminUser 
} from "@shared/admin-schema";
import { db } from "./db";
import { sales, reservations, inventory, adminUsers } from "@shared/admin-schema";
import { eq, desc, like, or } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IAdminStorage {
  // Sales operations
  getSales(): Promise<Sale[]>;
  getSale(id: number): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  updateSale(id: number, updates: Partial<Sale>): Promise<Sale | undefined>;
  deleteSale(id: number): Promise<boolean>;
  searchSales(query: string): Promise<Sale[]>;
  
  // Reservations operations
  getReservations(): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: number, updates: Partial<Reservation>): Promise<Reservation | undefined>;
  deleteReservation(id: number): Promise<boolean>;
  searchReservations(query: string): Promise<Reservation[]>;
  
  // Inventory operations
  getInventory(): Promise<InventoryItem[]>;
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, updates: Partial<InventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  searchInventory(query: string): Promise<InventoryItem[]>;
  
  // Admin user operations
  getAdminUser(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  validateAdminPassword(username: string, password: string): Promise<boolean>;
  updateLastLogin(username: string): Promise<void>;
}

export class DatabaseAdminStorage implements IAdminStorage {
  // Sales operations
  async getSales(): Promise<Sale[]> {
    return await db.select().from(sales).orderBy(desc(sales.createdAt));
  }

  async getSale(id: number): Promise<Sale | undefined> {
    const [sale] = await db.select().from(sales).where(eq(sales.id, id));
    return sale;
  }

  async createSale(saleData: InsertSale): Promise<Sale> {
    const [sale] = await db
      .insert(sales)
      .values({
        ...saleData,
        updatedAt: new Date(),
      })
      .returning();
    return sale;
  }

  async updateSale(id: number, updates: Partial<Sale>): Promise<Sale | undefined> {
    const [sale] = await db
      .update(sales)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(sales.id, id))
      .returning();
    return sale;
  }

  async deleteSale(id: number): Promise<boolean> {
    const result = await db.delete(sales).where(eq(sales.id, id));
    return result.rowCount > 0;
  }

  async searchSales(query: string): Promise<Sale[]> {
    return await db
      .select()
      .from(sales)
      .where(
        or(
          like(sales.customer, `%${query}%`),
          like(sales.item, `%${query}%`),
          like(sales.notes, `%${query}%`)
        )
      )
      .orderBy(desc(sales.createdAt));
  }

  // Reservations operations
  async getReservations(): Promise<Reservation[]> {
    return await db.select().from(reservations).orderBy(desc(reservations.createdAt));
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    const [reservation] = await db.select().from(reservations).where(eq(reservations.id, id));
    return reservation;
  }

  async createReservation(reservationData: InsertReservation): Promise<Reservation> {
    const [reservation] = await db
      .insert(reservations)
      .values({
        ...reservationData,
        updatedAt: new Date(),
      })
      .returning();
    return reservation;
  }

  async updateReservation(id: number, updates: Partial<Reservation>): Promise<Reservation | undefined> {
    const [reservation] = await db
      .update(reservations)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(reservations.id, id))
      .returning();
    return reservation;
  }

  async deleteReservation(id: number): Promise<boolean> {
    const result = await db.delete(reservations).where(eq(reservations.id, id));
    return result.rowCount > 0;
  }

  async searchReservations(query: string): Promise<Reservation[]> {
    return await db
      .select()
      .from(reservations)
      .where(
        or(
          like(reservations.customer, `%${query}%`),
          like(reservations.item, `%${query}%`),
          like(reservations.notes, `%${query}%`)
        )
      )
      .orderBy(desc(reservations.createdAt));
  }

  // Inventory operations
  async getInventory(): Promise<InventoryItem[]> {
    return await db.select().from(inventory).orderBy(desc(inventory.createdAt));
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventory).where(eq(inventory.id, id));
    return item;
  }

  async createInventoryItem(itemData: InsertInventoryItem): Promise<InventoryItem> {
    const [item] = await db
      .insert(inventory)
      .values({
        ...itemData,
        updatedAt: new Date(),
      })
      .returning();
    return item;
  }

  async updateInventoryItem(id: number, updates: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const [item] = await db
      .update(inventory)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(inventory.id, id))
      .returning();
    return item;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await db.delete(inventory).where(eq(inventory.id, id));
    return result.rowCount > 0;
  }

  async searchInventory(query: string): Promise<InventoryItem[]> {
    return await db
      .select()
      .from(inventory)
      .where(
        or(
          like(inventory.item, `%${query}%`),
          like(inventory.order, `%${query}%`),
          like(inventory.type, `%${query}%`),
          like(inventory.status, `%${query}%`),
          like(inventory.track, `%${query}%`),
          like(inventory.notes, `%${query}%`)
        )
      )
      .orderBy(desc(inventory.createdAt));
  }

  // Admin user operations
  async getAdminUser(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(userData: InsertAdminUser): Promise<AdminUser> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.passwordHash, saltRounds);
    
    const [user] = await db
      .insert(adminUsers)
      .values({
        ...userData,
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async validateAdminPassword(username: string, password: string): Promise<boolean> {
    const user = await this.getAdminUser(username);
    if (!user || !user.isActive) {
      return false;
    }
    
    return await bcrypt.compare(password, user.passwordHash);
  }

  async updateLastLogin(username: string): Promise<void> {
    await db
      .update(adminUsers)
      .set({
        lastLogin: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.username, username));
  }
}

export const adminStorage = new DatabaseAdminStorage();