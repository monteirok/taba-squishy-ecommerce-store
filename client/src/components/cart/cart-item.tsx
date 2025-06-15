import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import type { CartItemWithProduct } from "@shared/schema";

interface CartItemProps {
  item: CartItemWithProduct;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  isUpdating: boolean;
}

export function CartItem({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) {
  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, x: -100 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      whileHover={{ scale: 1.02 }}
    >
      <GlassCard className="p-4">
        <div className="flex items-center space-x-4">
          <motion.img
            src={item.product.image}
            alt={item.product.name}
            className="w-16 h-16 object-cover rounded-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <div className="flex-1">
            <motion.h3 
              className="font-semibold text-gray-800 dark:text-white"
              whileHover={{ scale: 1.05 }}
            >
              {item.product.name}
            </motion.h3>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              ${item.product.price}
            </motion.p>
          </div>
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDecreaseQuantity}
                disabled={isUpdating || item.quantity <= 1}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-0"
              >
                <motion.div
                  whileHover={{ rotate: -90 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Minus className="h-3 w-3" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.span 
              className="w-8 text-center text-sm font-medium"
              key={item.quantity}
              initial={{ scale: 1.3, color: "#8b5cf6" }}
              animate={{ scale: 1, color: "inherit" }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {item.quantity}
            </motion.span>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleIncreaseQuantity}
                disabled={isUpdating}
                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-0"
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Plus className="h-3 w-3" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isUpdating}
              className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 p-2"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.3 }}
              >
                <Trash2 className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
