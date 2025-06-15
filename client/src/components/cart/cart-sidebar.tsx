import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
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
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="fixed top-0 right-0 h-full w-96 max-w-full glass-strong z-50 overflow-y-auto"
          >
            <div className="p-6">
              <motion.div 
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h2 
                  className="text-2xl font-bold text-gray-800 dark:text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  Shopping Cart
                </motion.h2>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Cart Items */}
              <motion.div 
                className="space-y-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {cartItems.length === 0 ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <motion.div 
                      className="w-24 h-24 mx-auto mb-6 glass rounded-3xl flex items-center justify-center"
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ShoppingBag className="text-gray-400 text-3xl" />
                    </motion.div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Your cart is empty
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={onClose}
                        className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300"
                      >
                        Start Shopping
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 200,
                          damping: 20
                        }}
                        layout
                      >
                        <CartItem
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeFromCart}
                          isUpdating={isUpdating || isRemoving}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </motion.div>

              {/* Cart Summary */}
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.4 }}
                  >
                    <GlassCard className="p-6 space-y-4">
                      <motion.div 
                        className="flex justify-between items-center"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-gray-600 dark:text-gray-300">
                          Subtotal:
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </motion.div>
                      <motion.div 
                        className="flex justify-between items-center"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-gray-600 dark:text-gray-300">
                          Shipping:
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                          Free
                        </span>
                      </motion.div>
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
                        <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300">
                          Checkout
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => clearCart()}
                        >
                          Clear Cart
                        </Button>
                      </motion.div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
