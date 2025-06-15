import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/liquid-glass/button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass/liquid-glass-card";
import { CartItem } from "./cart-item";
import { useCart } from "@/hooks/use-cart";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    cartItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    isUpdating,
    isRemoving,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <LiquidGlassCard 
              variant="frosted" 
              intensity="strong" 
              className="h-full flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Shopping Cart
                  </h2>
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

              <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="popLayout">
                  {cartItems.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center justify-center h-full text-center space-y-4"
                    >
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Your cart is empty
                      </p>
                      <Button
                        variant="glass"
                        onClick={onClose}
                        className="mt-4"
                      >
                        Continue Shopping
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {cartItems.map((item) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {cartItems.length > 0 && (
                <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <motion.div 
                      className="flex justify-between items-center"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="text-lg font-semibold text-gray-800 dark:text-white">
                        Total:
                      </span>
                      <motion.span 
                        className="text-xl font-bold text-primary"
                        animate={{ 
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        ${totalPrice.toFixed(2)}
                      </motion.span>
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="glass-strong"
                      className="w-full"
                    >
                      Checkout
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="glass"
                      className="w-full"
                      onClick={() => clearCart()}
                    >
                      Clear Cart
                    </Button>
                  </motion.div>
                </div>
              )}
            </LiquidGlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
