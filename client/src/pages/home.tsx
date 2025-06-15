import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Star, Shield, Truck, RotateCcw, Headphones } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@shared/schema";
import { ButtonShowcase } from "@/components/ui/liquid-glass/liquid-glass-card";
import { Button as LiquidGlassButton } from "@/components/ui/liquid-glass/button";

export default function Home() {
  const { data: featuredProducts = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const categories = [
    {
      id: 1,
      name: "Stress Relief",
      description: "Perfect for anxiety and stress management",
      icon: Star,
      count: "24+ products",
    },
    {
      id: 2,
      name: "Kawaii Collection",
      description: "Adorable characters and cute designs",
      icon: Star,
      count: "18+ products",
    },
    {
      id: 3,
      name: "Fidget & Focus",
      description: "Help improve concentration and focus",
      icon: Star,
      count: "12+ products",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Made from high-grade, non-toxic materials that are safe for all ages",
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Free shipping on orders over $25. Express delivery available",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy. Not satisfied? We'll make it right",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our friendly team is here to help you anytime, anywhere",
    },
  ];

  return (
    <div className="pt-24">

      {/* Hero Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
            >
              <motion.span 
                className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Squeeze the Joy
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Discover our premium collection of squishy toys that bring comfort, stress relief, and endless fun to your daily life.
            </motion.p>

            {/* Hero Image Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {[1, 2, 3, 4].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.8 + (index * 0.1),
                    duration: 0.6,
                    type: "spring",
                    stiffness: 120,
                    damping: 20
                  }}
                  whileHover={{ 
                    y: -10,
                    rotate: [0, -5, 5, 0],
                    transition: { 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      rotate: { duration: 0.6 }
                    } 
                  }}
                >
                  <GlassCard className="p-6">
                    <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <Star className="w-8 h-8 text-primary" />
                      </motion.div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <Link href="/products">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:shadow-xl transition-all duration-300 text-lg">
                    <span>Shop Now</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="px-8 py-4 glass-strong hover:glass text-lg"
                >
                  <span>Watch Demo</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
              whileHover={{ scale: 1.02 }}
            >
              Popular Categories
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Find the perfect squishy for every mood and occasion
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  y: -8,
                  transition: { 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  } 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard hover className="p-8 text-center group cursor-pointer">
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 liquid-gradient rounded-2xl flex items-center justify-center"
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -2, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <category.icon className="text-white text-2xl" />
                    </motion.div>
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-semibold text-gray-800 dark:text-white mb-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    {category.name}
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {category.description}
                  </p>
                  <motion.span 
                    className="text-primary font-medium"
                    whileHover={{ scale: 1.1 }}
                  >
                    {category.count}
                  </motion.span>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Hand-picked favorites from our collection
              </p>
            </div>

            <Link href="/products">
              <Button
                variant="outline"
                className="mt-6 md:mt-0 glass-strong hover:glass"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <ProductGrid products={featuredProducts} />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
              whileHover={{ scale: 1.02 }}
            >
              Why Choose Taba Squishy?
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Experience the difference with our premium quality squishies
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  transition: { 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  } 
                }}
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 liquid-gradient rounded-3xl flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { 
                      scale: { type: "spring", stiffness: 300 },
                      rotate: { duration: 0.4 }
                    }
                  }}
                  animate={{ 
                    y: [0, -2, 0],
                    boxShadow: [
                      "0 4px 15px rgba(0,0,0,0.1)",
                      "0 8px 25px rgba(0,0,0,0.15)",
                      "0 4px 15px rgba(0,0,0,0.1)"
                    ]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  >
                    <feature.icon className="text-white text-3xl" />
                  </motion.div>
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold text-gray-800 dark:text-white mb-3"
                  whileHover={{ scale: 1.05, color: "rgb(139, 92, 246)" }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 dark:text-gray-300"
                  whileHover={{ scale: 1.02 }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
