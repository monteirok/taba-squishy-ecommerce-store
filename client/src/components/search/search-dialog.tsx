import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Focus input when dialog opens and handle animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Delay focus to allow animation to start
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        setIsAnimating(false);
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <VisuallyHidden>
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>Search for products by name, description, or category</DialogDescription>
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
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                    variant="glass"
                    onClick={() => refetch()}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </motion.div>
              ) : !searchQuery ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Start typing to search products</p>
                </motion.div>
              ) : products?.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <p className="text-gray-500">No products found</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {products?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </LiquidGlassCard>
        </motion.div>
      </DialogContent>
    </Dialog>
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