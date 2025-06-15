import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/liquid-glass/button";
import { ProductCard } from "@/components/product/product-card";
import { LiquidGlassCard } from "@/components/ui/liquid-glass/liquid-glass-card";
import type { Product } from "@shared/schema";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Focus input when dialog opens and handle animation
  useEffect(() => {
    if (isOpen) {
      // Delay focus to allow animation to start
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const { data: products, isLoading, error, refetch } = useQuery<Product[]>({
    queryKey: ["/api/products/search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
    enabled: !!debouncedQuery,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-0 bg-transparent shadow-none">
            <VisuallyHidden>
              <div>
                <h2>Search Products</h2>
                <p>Search for products by name, description, or category</p>
              </div>
            </VisuallyHidden>
            <motion.div
              initial={{
                scale: 0.1,
                opacity: 0,
                x: "calc(100vw - 120px)",
                y: "calc(100vh - 120px)",
                borderRadius: "50px",
              }}
              animate={{
                scale: 1,
                opacity: 1,
                x: 0,
                y: 0,
                borderRadius: "16px",
              }}
              exit={{
                scale: 0.1,
                opacity: 0,
                x: "calc(100vw - 120px)",
                y: "calc(100vh - 120px)",
                borderRadius: "50px",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              className="w-full max-w-[800px]"
            >
              <LiquidGlassCard variant="frosted" intensity="medium" className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass hover:glass-strong"
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="glass hover:glass-strong"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="relative min-h-[200px]">
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                        className="flex items-center justify-center py-8"
                      >
                        <motion.div
                          animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            rotate: {
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear"
                            },
                            scale: {
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                        >
                          <Loader2 className="h-8 w-8 text-primary" />
                        </motion.div>
                      </motion.div>
                    ) : error ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-8"
                      >
                        <p className="text-red-500">Error loading products</p>
                        <Button
                          variant="ghost"
                          onClick={() => refetch()}
                          className="mt-4"
                        >
                          Try Again
                        </Button>
                      </motion.div>
                    ) : !debouncedQuery ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }}
                        className="text-center py-8"
                      >
                        <motion.div
                          animate={{
                            y: [0, -8, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        </motion.div>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-gray-500"
                        >
                          Start typing to search products
                        </motion.p>
                      </motion.div>
                    ) : products?.length === 0 ? (
                      <motion.div
                        key="no-results"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }}
                        className="text-center py-8"
                      >
                        <motion.div
                          animate={{
                            x: [0, -10, 10, 0]
                          }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                          }}
                        >
                          <p className="text-gray-500">No products found for "{debouncedQuery}"</p>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {products?.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ 
                              opacity: 0, 
                              y: 80,
                              scale: 0.6,
                              rotateX: -25,
                              rotateY: 10
                            }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              scale: 1,
                              rotateX: 0,
                              rotateY: 0
                            }}
                            exit={{
                              opacity: 0,
                              y: -30,
                              scale: 0.8,
                              transition: {
                                duration: 0.2
                              }
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 20,
                              delay: index * 0.08,
                              duration: 0.8
                            }}
                            whileHover={{
                              scale: 1.05,
                              y: -12,
                              rotateY: 5,
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 12
                              }
                            }}
                            whileTap={{
                              scale: 0.95,
                              y: 2,
                              transition: {
                                type: "spring",
                                stiffness: 800,
                                damping: 15
                              }
                            }}
                            style={{
                              transformStyle: "preserve-3d"
                            }}
                          >
                            <motion.div
                              animate={{
                                boxShadow: [
                                  "0 4px 20px rgba(0,0,0,0.1)",
                                  "0 8px 25px rgba(0,0,0,0.15)",
                                  "0 4px 20px rgba(0,0,0,0.1)"
                                ]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="rounded-lg"
                            >
                              <ProductCard product={product} />
                            </motion.div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </LiquidGlassCard>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}