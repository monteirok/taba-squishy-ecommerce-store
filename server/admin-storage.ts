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

export class MemAdminStorage implements IAdminStorage {
  private sales: Map<number, Sale>;
  private reservations: Map<number, Reservation>;
  private inventory: Map<number, InventoryItem>;
  private adminUsers: Map<string, AdminUser>;
  private currentSaleId: number;
  private currentReservationId: number;
  private currentInventoryId: number;
  private currentAdminId: number;

  constructor() {
    this.sales = new Map();
    this.reservations = new Map();
    this.inventory = new Map();
    this.adminUsers = new Map();
    this.currentSaleId = 1;
    this.currentReservationId = 1;
    this.currentInventoryId = 1;
    this.currentAdminId = 1;
    this.seedData();
  }

  private async seedData() {
    // Seed sales data from spreadsheet
    const salesData = [
      { customer: "Shelby", item: "SISI", qty: 1, pricePaid: "50.00", pickupDate: "6/14/2025", notes: "trading opened sisi for Dada" },
      { customer: "Regina", item: "SISI", qty: 1, pricePaid: "50.00", pickupDate: "6/14/2025", notes: "" },
      { customer: "Andrew", item: "BABA", qty: 1, pricePaid: "50.00", pickupDate: "6/14/2025", notes: "" },
      { customer: "Meaghan", item: "QUQU", qty: 1, pricePaid: "50.00", pickupDate: "6/14/2025", notes: "" },
      { customer: "SaroSH", item: "SEA SALT COCONUT", qty: 1, pricePaid: "60.00", pickupDate: "6/14/2025", notes: "" },
      { customer: "Liam", item: "TOFFEE", qty: 1, pricePaid: "30.00", pickupDate: "6/14/2025", notes: "" }
    ];

    salesData.forEach((data, index) => {
      const sale: Sale = {
        id: this.currentSaleId++,
        customer: data.customer,
        item: data.item,
        qty: data.qty,
        pricePaid: data.pricePaid,
        pickupDate: data.pickupDate,
        notes: data.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.sales.set(sale.id, sale);
    });

    // Seed reservations data from spreadsheet
    const reservationsData = [
      { customer: "Shelby", item: "SISI", pricePaid: "50.00", qty: 1, dateSold: "mm/yyyy", notes: "trading Sisi for their Dada" },
      { customer: "Regina", item: "SISI", pricePaid: "50.00", qty: 1, dateSold: "mm/yyyy", notes: "" },
      { customer: "Andrew", item: "BABA", pricePaid: "50.00", qty: 1, dateSold: "mm/yyyy", notes: "" },
      { customer: "Meaghan", item: "QUQU", pricePaid: "50.00", qty: 1, dateSold: "mm/yyyy", notes: "" },
      { customer: "SaroSH", item: "SEA SALT COCONUT", pricePaid: "60.00", qty: 1, dateSold: "mm/yyyy", notes: "" },
      { customer: "Liam", item: "TOFFEE", pricePaid: "50.00", qty: 1, dateSold: "mm/yyyy", notes: "" }
    ];

    reservationsData.forEach((data, index) => {
      const reservation: Reservation = {
        id: this.currentReservationId++,
        customer: data.customer,
        item: data.item,
        pricePaid: data.pricePaid,
        qty: data.qty,
        dateSold: data.dateSold,
        notes: data.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.reservations.set(reservation.id, reservation);
    });

    // Seed inventory data from spreadsheet
    const inventoryData = [
      { order: "N/A", type: "MAC", item: "SEA SALT COCONUT", retailPrice: "30.00", resellPrice: "60.00", stock: 1, status: "Shipping", track: "PARCEL", notes: "" },
      { order: "GROUP 2", type: "MAC", item: "GREEN GRAPE", retailPrice: "30.00", resellPrice: "60.00", stock: 1, status: "Shipping", track: "PARCEL 2", notes: "" },
      { order: "GROUP 1", type: "MAC", item: "TOFFEE", retailPrice: "30.00", resellPrice: "60.00", stock: 1, status: "Shipping", track: "PARCEL 1", notes: "" },
      { order: "", type: "MAC", item: "LYCHEE BERRY", retailPrice: "30.00", resellPrice: "60.00", stock: 0, status: "Sold out", track: "", notes: "" },
      { order: "", type: "MAC", item: "SESAME BEAN", retailPrice: "30.00", resellPrice: "60.00", stock: 0, status: "Sold out", track: "", notes: "" },
      { order: "", type: "MAC", item: "SOYMILK", retailPrice: "30.00", resellPrice: "60.00", stock: 0, status: "Sold out", track: "", notes: "" },
      { order: "GROUP 1", type: "HAS", item: "ZIZI", retailPrice: "30.00", resellPrice: "60.00", stock: 1, status: "Shipping", track: "PARCEL 1", notes: "" },
      { order: "GROUP 1", type: "HAS", item: "BABA", retailPrice: "30.00", resellPrice: "50.00", stock: 1, status: "Shipping", track: "PARCEL 1", notes: "" },
      { order: "GROUP 3", type: "HAS", item: "QUQU", retailPrice: "30.00", resellPrice: "60.00", stock: 1, status: "Shipping", track: "PARCEL 3", notes: "" },
      { order: "GROUP 3", type: "HAS", item: "SISI", retailPrice: "30.00", resellPrice: "50.00", stock: 1, status: "Shipping", track: "PARCEL 3", notes: "" },
      { order: "GROUP 3", type: "HAS", item: "SISI", retailPrice: "30.00", resellPrice: "60.00", stock: 1, status: "Shipping", track: "PARCEL 3", notes: "x1 Sisi has been fully opened and taken out of the box" },
      { order: "", type: "HAS", item: "DADA", retailPrice: "30.00", resellPrice: "50.00", stock: 0, status: "Sold out", track: "", notes: "" }
    ];

    inventoryData.forEach((data, index) => {
      const item: InventoryItem = {
        id: this.currentInventoryId++,
        order: data.order,
        type: data.type,
        item: data.item,
        retailPrice: data.retailPrice,
        resellPrice: data.resellPrice,
        stock: data.stock,
        status: data.status,
        track: data.track,
        notes: data.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.inventory.set(item.id, item);
    });

    // Create default admin user
    await this.createAdminUser({
      username: "admin",
      email: "admin@labubu.com",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "admin",
      isActive: true
    });
  }

  // Sales operations
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getSale(id: number): Promise<Sale | undefined> {
    return this.sales.get(id);
  }

  async createSale(saleData: InsertSale): Promise<Sale> {
    const sale: Sale = {
      id: this.currentSaleId++,
      ...saleData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sales.set(sale.id, sale);
    return sale;
  }

  async updateSale(id: number, updates: Partial<Sale>): Promise<Sale | undefined> {
    const sale = this.sales.get(id);
    if (!sale) return undefined;
    
    const updatedSale = { ...sale, ...updates, updatedAt: new Date() };
    this.sales.set(id, updatedSale);
    return updatedSale;
  }

  async deleteSale(id: number): Promise<boolean> {
    return this.sales.delete(id);
  }

  async searchSales(query: string): Promise<Sale[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.sales.values()).filter(sale =>
      sale.customer.toLowerCase().includes(lowerQuery) ||
      sale.item.toLowerCase().includes(lowerQuery) ||
      (sale.notes && sale.notes.toLowerCase().includes(lowerQuery))
    );
  }

  // Reservations operations
  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(reservationData: InsertReservation): Promise<Reservation> {
    const reservation: Reservation = {
      id: this.currentReservationId++,
      ...reservationData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reservations.set(reservation.id, reservation);
    return reservation;
  }

  async updateReservation(id: number, updates: Partial<Reservation>): Promise<Reservation | undefined> {
    const reservation = this.reservations.get(id);
    if (!reservation) return undefined;
    
    const updatedReservation = { ...reservation, ...updates, updatedAt: new Date() };
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }

  async deleteReservation(id: number): Promise<boolean> {
    return this.reservations.delete(id);
  }

  async searchReservations(query: string): Promise<Reservation[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.reservations.values()).filter(reservation =>
      reservation.customer.toLowerCase().includes(lowerQuery) ||
      reservation.item.toLowerCase().includes(lowerQuery) ||
      (reservation.notes && reservation.notes.toLowerCase().includes(lowerQuery))
    );
  }

  // Inventory operations
  async getInventory(): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    return this.inventory.get(id);
  }

  async createInventoryItem(itemData: InsertInventoryItem): Promise<InventoryItem> {
    const item: InventoryItem = {
      id: this.currentInventoryId++,
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.inventory.set(item.id, item);
    return item;
  }

  async updateInventoryItem(id: number, updates: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const item = this.inventory.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates, updatedAt: new Date() };
    this.inventory.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventory.delete(id);
  }

  async searchInventory(query: string): Promise<InventoryItem[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.inventory.values()).filter(item =>
      item.item.toLowerCase().includes(lowerQuery) ||
      (item.order && item.order.toLowerCase().includes(lowerQuery)) ||
      (item.type && item.type.toLowerCase().includes(lowerQuery)) ||
      (item.status && item.status.toLowerCase().includes(lowerQuery)) ||
      (item.track && item.track.toLowerCase().includes(lowerQuery)) ||
      (item.notes && item.notes.toLowerCase().includes(lowerQuery))
    );
  }

  // Admin user operations
  async getAdminUser(username: string): Promise<AdminUser | undefined> {
    return this.adminUsers.get(username);
  }

  async createAdminUser(userData: InsertAdminUser): Promise<AdminUser> {
    const user: AdminUser = {
      id: this.currentAdminId++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    this.adminUsers.set(user.username, user);
    return user;
  }

  async validateAdminPassword(username: string, password: string): Promise<boolean> {
    const user = this.adminUsers.get(username);
    if (!user || !user.isActive) return false;
    return await bcrypt.compare(password, user.passwordHash);
  }

  async updateLastLogin(username: string): Promise<void> {
    const user = this.adminUsers.get(username);
    if (user) {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
      this.adminUsers.set(username, user);
    }
  }
}

export const adminStorage = new MemAdminStorage();