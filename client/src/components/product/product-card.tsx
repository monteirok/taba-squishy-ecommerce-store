import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/liquid-glass/button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass/liquid-glass-card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { WishlistHeart } from "@/components/wishlist-heart";
import type { Product } from "@shared/schema";

const formatPrice = (price: string) => {
  return Number(price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart, isAddingToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      quantity: 1,
    });
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Link href={`/products/${product.id}`}>
        <LiquidGlassCard variant="frosted" intensity="medium" className="overflow-hidden">
          <div className="relative">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }}
            />
            <motion.div 
              className="absolute top-4 left-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {product.featured && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge className="bg-secondary text-secondary-foreground">
                    Bestseller
                  </Badge>
                </motion.div>
              )}
              {hasDiscount && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-2 inline-block"
                >
                  <Badge className="bg-red-500 text-white">
                    -{discountPercentage}%
                  </Badge>
                </motion.div>
              )}
            </motion.div>
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleLike}
                  className={`w-10 h-10 glass rounded-full p-0 transition-all duration-300 ${
                    isLiked 
                      ? "bg-red-500 text-white hover:bg-red-600" 
                      : "hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <motion.div
                    animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 500,
                      damping: 15
                    }}
                  >
                    <Heart 
                      className="h-4 w-4" 
                      fill={isLiked ? "currentColor" : "none"}
                    />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          <div className="p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <motion.div
                    className="text-xl font-bold text-primary"
                    animate={{ 
                      scale: hasDiscount ? [1, 1.05, 1] : 1
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    ${formatPrice(product.price)}
                  </motion.div>
                  {hasDiscount && (
                    <motion.div
                      className="text-sm text-gray-500 line-through"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      ${formatPrice(product.originalPrice!)}
                    </motion.div>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product.inStock}
                    variant="glass-strong"
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center space-x-2">
                        <motion.div 
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Adding...</span>
                      </div>
                    ) : !product.inStock ? (
                      "Out of Stock"
                    ) : (
                      <>
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.3 }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                        </motion.div>
                        Add to Cart
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </LiquidGlassCard>
      </Link>
    </motion.div>
  );
}
