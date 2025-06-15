import { products, cartItems, type Product, type InsertProduct, type CartItem, type InsertCartItem, type CartItemWithProduct } from "@shared/schema";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart operations
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private currentProductId: number;
  private currentCartItemId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.seedProducts();
  }

  private seedProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Kawaii Cat Squishy",
        description: "Adorable cat-shaped stress relief toy with big eyes and soft texture",
        price: "12.99",
        originalPrice: "16.99",
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        category: "kawaii",
        tags: ["cat", "kawaii", "stress-relief"],
        inStock: true,
        featured: true,
      },
      {
        name: "Stress Relief Ball",
        description: "Perfect for hand exercise and stress relief therapy",
        price: "8.99",
        originalPrice: "11.99",
        image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        category: "stress-relief",
        tags: ["stress-relief", "therapy", "exercise"],
        inStock: true,
        featured: true,
      },
      {
        name: "Slow Rise Panda",
        description: "Super soft slow-rising panda squishy with authentic scent",
        price: "15.99",
        image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        category: "kawaii",
        tags: ["panda", "slow-rise", "scented"],
        inStock: true,
        featured: true,
      },
      {
        name: "Magic Unicorn",
        description: "Sparkly unicorn with rainbow mane and glittery finish",
        price: "18.99",
        image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        category: "kawaii",
        tags: ["unicorn", "rainbow", "sparkly"],
        inStock: true,
        featured: true,
      },
      {
        name: "Pop It Fidget",
        description: "Satisfying bubble popping experience for focus and relaxation",
        price: "6.99",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        category: "fidget",
        tags: ["pop-it", "fidget", "focus"],
        inStock: true,
        featured: false,
      },
      {
        name: "Sweet Donut",
        description: "Delicious-looking donut squishy with realistic frosting texture",
        price: "9.99",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        category: "food",
        tags: ["donut", "sweet", "realistic"],
        inStock: true,
        featured: false,
      },
      {
        name: "Therapy Putty",
        description: "Professional-grade stress relief putty for hand strengthening",
        price: "14.99",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        category: "therapy",
        tags: ["therapy", "professional", "strengthening"],
        inStock: true,
        featured: false,
      },
      {
        name: "Mini Collection Set",
        description: "Set of 6 mini squishy characters in various designs",
        price: "24.99",
        originalPrice: "35.99",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
        category: "sets",
        tags: ["mini", "collection", "variety"],
        inStock: true,
        featured: true,
      },
    ];

    sampleProducts.forEach(product => {
      const id = this.currentProductId++;
      const fullProduct: Product = { 
        ...product, 
        id,
        originalPrice: product.originalPrice || null,
        tags: product.tags || null,
        inStock: product.inStock !== undefined ? product.inStock : true,
        featured: product.featured !== undefined ? product.featured : false
      };
      this.products.set(id, fullProduct);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.featured
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      originalPrice: insertProduct.originalPrice || null,
      tags: insertProduct.tags || null,
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : true,
      featured: insertProduct.featured !== undefined ? insertProduct.featured : false
    };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(
      item => item.sessionId === sessionId
    );
    
    const itemsWithProducts: CartItemWithProduct[] = [];
    for (const item of items) {
      const product = this.products.get(item.productId);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }
    
    return itemsWithProducts;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.productId === insertItem.productId && item.sessionId === insertItem.sessionId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertItem.quantity || 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Create new item
      const id = this.currentCartItemId++;
      const cartItem: CartItem = { 
        ...insertItem, 
        id,
        quantity: insertItem.quantity || 1
      };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToDelete = Array.from(this.cartItems.entries()).filter(
      ([_, item]) => item.sessionId === sessionId
    );
    
    itemsToDelete.forEach(([id]) => {
      this.cartItems.delete(id);
    });
  }
}

export const storage = new MemStorage();
