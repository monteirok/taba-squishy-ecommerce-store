import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

const formatPrice = (price: string) => {
  return Number(price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export default function Wishlist() {
  const { wishlistItems, isLoading, removeFromWishlist, isRemovingFromWishlist } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (productId: number, productName: string) => {
    try {
      await addToCart({
        productId,
        quantity: 1,
      });
      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWishlist = async (productId: number, productName: string) => {
    try {
      await removeFromWishlist(productId);
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <motion.div 
              className="w-16 h-16 mx-auto mb-4 border-4 border-pink-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-600 dark:text-gray-300">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-pink-500 mr-3 fill-pink-500" />
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                Your Wishlist
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Keep track of items you love and add them to your cart when ready
            </p>
          </motion.div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <GlassCard className="p-12 max-w-md mx-auto">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Start browsing our products and save your favorites here
              </p>
              <Link href="/products">
                <Button variant="default" className="w-full">
                  Browse Products
                </Button>
              </Link>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                >
                  <GlassCard className="overflow-hidden group">
                    <div className="relative">
                      <Link href={`/products/${item.product.id}`}>
                        <motion.img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-48 object-cover cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20 
                          }}
                        />
                      </Link>
                      <motion.button
                        onClick={() => handleRemoveFromWishlist(item.product.id, item.product.name)}
                        disabled={isRemovingFromWishlist}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    <div className="p-4">
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 cursor-pointer hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {item.product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-primary">
                          ${formatPrice(item.product.price)}
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => handleAddToCart(item.product.id, item.product.name)}
                            disabled={isAddingToCart || !item.product.inStock}
                            size="sm"
                            variant="default"
                            className="disabled:opacity-50"
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
                            ) : !item.product.inStock ? (
                              "Out of Stock"
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Quick Actions */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <GlassCard className="p-6 max-w-md mx-auto">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Quick Actions
              </h4>
              <div className="space-y-3">
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
                <Button 
                  onClick={() => {
                    wishlistItems.forEach(item => {
                      if (item.product.inStock) {
                        handleAddToCart(item.product.id, item.product.name);
                      }
                    });
                  }}
                  variant="default"
                  className="w-full"
                  disabled={wishlistItems.every(item => !item.product.inStock)}
                >
                  Add All to Cart
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}