import { db } from "./db";
import { adminUsers, sales, reservations, inventory } from "@shared/admin-schema";
import { gameRewards } from "@shared/game-schema";
import bcrypt from "bcrypt";

async function initializeAdminData() {
  try {
    console.log("Initializing admin data...");

    // Skip database initialization if no database is available
    if (!db) {
      console.log("No database available, using memory storage initialization");
      return;
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await db.insert(adminUsers).values({
      username: "admin",
      email: "admin@example.com",
      passwordHash: hashedPassword,
      role: "admin",
      isActive: true,
    }).onConflictDoNothing();

    // Insert sales data from spreadsheet
    await db.insert(sales).values([
      {
        customer: "Shelby",
        item: "SISI",
        qty: 1,
        pricePaid: "50.00",
        pickupDate: "6/14/2025",
        notes: "trading opened Sisi for Dada",
      },
      {
        customer: "Regina",
        item: "SISI",
        qty: 1,
        pricePaid: "50.00",
        pickupDate: "6/14/2025",
        notes: "",
      },
      {
        customer: "Andrew",
        item: "BABA",
        qty: 1,
        pricePaid: "50.00",
        pickupDate: "6/14/2025",
        notes: "",
      },
      {
        customer: "Meaghan",
        item: "QUQU",
        qty: 1,
        pricePaid: "50.00",
        pickupDate: "6/14/2025",
        notes: "",
      },
      {
        customer: "SaroSH",
        item: "SEA SALT COCONUT",
        qty: 1,
        pricePaid: "60.00",
        pickupDate: "6/14/2025",
        notes: "",
      },
      {
        customer: "Liam",
        item: "TOFFEE",
        qty: 1,
        pricePaid: "30.00",
        pickupDate: "6/14/2025",
        notes: "",
      },
    ]).onConflictDoNothing();

    // Insert reservations data from spreadsheet
    await db.insert(reservations).values([
      {
        customer: "Shelby",
        item: "SISI",
        pricePaid: "50.00",
        qty: 1,
        dateSold: "mm/dd/yyyy",
        notes: "trading Sisi for their Dada",
      },
      {
        customer: "Regina",
        item: "SISI",
        pricePaid: "50.00",
        qty: 1,
        dateSold: "mm/dd/yyyy",
        notes: "",
      },
      {
        customer: "Andrew",
        item: "BABA",
        pricePaid: "50.00",
        qty: 1,
        dateSold: "mm/dd/yyyy",
        notes: "",
      },
      {
        customer: "Meaghan",
        item: "QUQU",
        pricePaid: "50.00",
        qty: 1,
        dateSold: "mm/dd/yyyy",
        notes: "",
      },
      {
        customer: "SaroSH",
        item: "SEA SALT COCONUT",
        pricePaid: "60.00",
        qty: 1,
        dateSold: "mm/dd/yyyy",
        notes: "",
      },
      {
        customer: "Liam",
        item: "TOFFEE",
        pricePaid: "50.00",
        qty: 1,
        dateSold: "mm/dd/yyyy",
        notes: "",
      },
    ]).onConflictDoNothing();

    // Insert inventory data from spreadsheet
    await db.insert(inventory).values([
      {
        order: "N/A",
        type: "MAC",
        item: "SEA SALT COCONUT",
        retailPrice: "30.00",
        resellPrice: "60.00",
        stock: 1,
        status: "Shipping",
        track: "PARCEL",
        notes: "",
      },
      {
        order: "GROUP 2",
        type: "MAC",
        item: "GREEN GRAPE",
        retailPrice: "30.00",
        resellPrice: "60.00",
        stock: 1,
        status: "Shipping",
        track: "PARCEL 2",
        notes: "",
      },
      {
        order: "GROUP 1",
        type: "MAC",
        item: "TOFFEE",
        retailPrice: "30.00",
        resellPrice: "60.00",
        stock: 1,
        status: "Shipping",
        track: "PARCEL 1",
        notes: "",
      },
      {
        order: "",
        type: "MAC",
        item: "LYCHEE BERRY",
        retailPrice: "30.00",
        resellPrice: "60.00",
        stock: 0,
        status: "Sold out",
        track: "",
        notes: "",
      },
      {
        order: "",
        type: "MAC",
        item: "SESAME BEAN",
        retailPrice: "30.00",
        resellPrice: "60.00",
        stock: 0,
        status: "Sold out",
        track: "",
        notes: "",
      },
      {
        order: "",
        type: "MAC",
        item: "SOYMILK",
        retailPrice: "30.00",
        resellPrice: "60.00",
        stock: 0,
        status: "Sold out",
        track: "",
        notes: "",
      },
      {
        order: "GROUP 1",
        type: "HAS",
        item: "ZIZI",
        retailPrice: "30.00",
        resellPrice: "60.00",
        stock: 1,
        status: "Shipping",
        track: "PARCEL 1",
        notes: "",
      },
      {
        order: "GROUP 1",
        type: "HAS",
        item: "BABA",
        retailPrice: "30.00",
        resellPrice: "50.00",
        stock: 1,
        status: "Shipping",
        track: "PARCEL 1",
        notes: "",
      },
      {
        order: "GROUP 3",
        type: "HAS",
        item: "QUQU",
        retailPrice: "30.00",
        resellPrice: "60.00",
        stock: 1,
        status: "Shipping",
        track: "PARCEL 3",
        notes: "",
      },
      {
        order: "GROUP 3",
        type: "HAS",
        item: "SHOO",
        retailPrice: "30.00",
        resellPrice: "50.00",
        stock: 1,
        status: "Shipping",
        track: "PARCEL 3",
        notes: "",
      },
      {
        order: "GROUP 3",
        type: "HAS",
        item: "SISI",
        retailPrice: "30.00",
        resellPrice: "60.00",
        stock: 1,
        status: "Shipping",
        track: "PARCEL 3",
        notes: "x1 Sisi has been fully opened and taken out of the box",
      },
      {
        order: "",
        type: "HAS",
        item: "DADA",
        retailPrice: "30.00",
        resellPrice: "50.00",
        stock: 0,
        status: "Sold out",
        track: "",
        notes: "",
      },
    ]).onConflictDoNothing();

    // Insert game rewards
    await db.insert(gameRewards).values([
      {
        name: "5% Discount Code",
        description: "Get 5% off your next purchase",
        pointsCost: 50,
        rewardType: "discount",
        rewardValue: "5",
        isActive: true,
        maxRedemptions: 100,
        currentRedemptions: 0,
      },
      {
        name: "10% Discount Code",
        description: "Get 10% off your next purchase",
        pointsCost: 100,
        rewardType: "discount",
        rewardValue: "10",
        isActive: true,
        maxRedemptions: 50,
        currentRedemptions: 0,
      },
      {
        name: "Free Shipping",
        description: "Free shipping on your next order",
        pointsCost: 75,
        rewardType: "discount",
        rewardValue: "Free Shipping",
        isActive: true,
        maxRedemptions: 200,
        currentRedemptions: 0,
      },
      {
        name: "Squishy Master Badge",
        description: "Exclusive badge for top players",
        pointsCost: 200,
        rewardType: "badge",
        rewardValue: "Squishy Master",
        isActive: true,
        maxRedemptions: 10,
        currentRedemptions: 0,
      },
      {
        name: "Mystery Squishy",
        description: "Random squishy from our collection",
        pointsCost: 300,
        rewardType: "product",
        rewardValue: "Mystery Box",
        isActive: true,
        maxRedemptions: 20,
        currentRedemptions: 0,
      },
    ]).onConflictDoNothing();

    console.log("Admin data initialized successfully!");
  } catch (error) {
    console.error("Error initializing admin data:", error);
  }
}

// Auto-initialize when server starts
initializeAdminData();

export { initializeAdminData };