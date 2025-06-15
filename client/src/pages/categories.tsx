import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Heart, Gamepad2, Cookie, Stethoscope, Gift } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { LiquidGlassCard } from "@/components/ui/liquid-glass/liquid-glass-card";
import { Button } from "@/components/ui/button";
import { AnimatedLoader } from "@/components/ui/animated-loader";
import type { Product } from "@shared/schema";

const categories = [
  {
    id: "all",
    name: "All",
    description: "Complete collection",
    icon: Package,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "kawaii",
    name: "Kawaii",
    description: "Cute characters",
    icon: Heart,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "stress-relief",
    name: "Stress Relief",
    description: "Relaxation tools",
    icon: Stethoscope,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "fidget",
    name: "Fidget",
    description: "Focus & concentration",
    icon: Gamepad2,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "food",
    name: "Food",
    description: "Realistic treats",
    icon: Cookie,
    color: "from-orange-500 to-amber-500"
  },
  {
    id: "therapy",
    name: "Therapy",
    description: "Professional tools",
    icon: Stethoscope,
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: "sets",
    name: "Sets",
    description: "Gift bundles",
    icon: Gift,
    color: "from-violet-500 to-fuchsia-500"
  }
];

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: selectedCategory === "all" ? ["/api/products"] : ["/api/products/category", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === "all" 
        ? "/api/products" 
        : `/api/products/category/${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Product Categories
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our carefully curated collection of stress relief and kawaii products
          </p>
        </motion.div>

        {/* Category Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <LiquidGlassCard variant="frosted" className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Button
                      onClick={() => setSelectedCategory(category.id)}
                      variant={isSelected ? "default" : "outline"}
                      className={`h-auto p-3 flex flex-col items-center space-y-2 w-full transition-all duration-300 min-h-[100px] ${
                        isSelected 
                          ? `bg-gradient-to-br ${category.color} text-white shadow-lg scale-105` 
                          : "glass hover:glass-strong hover:scale-105"
                      }`}
                    >
                      <motion.div
                        animate={isSelected ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>
                      <div className="text-center flex-1 flex flex-col justify-center">
                        <div className="font-semibold text-xs leading-tight">{category.name}</div>
                        <div className="text-[10px] opacity-75 mt-1 leading-tight line-clamp-2">{category.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </LiquidGlassCard>
        </motion.div>

        {/* Selected Category Info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <LiquidGlassCard variant="default" className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-gradient-to-br ${selectedCategoryData?.color} text-white`}>
                  {selectedCategoryData && <selectedCategoryData.icon className="h-6 w-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedCategoryData?.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedCategoryData?.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {products.length} {products.length === 1 ? 'product' : 'products'} available
                  </p>
                </div>
              </div>
            </LiquidGlassCard>
          </motion.div>
        </AnimatePresence>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <AnimatedLoader type="dots" size="lg" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-12"
            >
              <LiquidGlassCard variant="frosted" className="p-8 max-w-md mx-auto">
                <p className="text-red-500 mb-4">Failed to load products</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="glass hover:glass-strong"
                >
                  Try Again
                </Button>
              </LiquidGlassCard>
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <LiquidGlassCard variant="frosted" className="p-8 max-w-md mx-auto">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">
                  No products found in this category
                </p>
              </LiquidGlassCard>
            </motion.div>
          ) : (
            <motion.div
              key={`products-${selectedCategory}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ProductGrid products={products} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}