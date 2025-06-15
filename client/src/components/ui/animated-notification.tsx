import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedNotificationProps {
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center";
}

export function AnimatedNotification({
  type = "info",
  title,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
  position = "top-right"
}: AnimatedNotificationProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200",
    error: "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200",
    warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200",
    info: "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
  };

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500", 
    info: "text-blue-500"
  };

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2"
  };

  const slideDirection = position.includes("right") ? { x: 100 } : position.includes("left") ? { x: -100 } : { y: -100 };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn("fixed z-50 max-w-md", positionClasses[position])}
          initial={{ opacity: 0, scale: 0.8, ...slideDirection }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, ...slideDirection }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.4
          }}
        >
          <motion.div
            className={cn(
              "relative p-4 rounded-lg border-l-4 shadow-lg glass backdrop-blur-md",
              colors[type]
            )}
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            whileHover={{ scale: 1.02, y: -2 }}
            layout
          >
            <div className="flex items-start space-x-3">
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              >
                <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", iconColors[type])} />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <motion.h4
                  className="font-semibold text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h4>
                {message && (
                  <motion.p
                    className="text-sm mt-1 opacity-90"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {message}
                  </motion.p>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 hover:bg-white/20 dark:hover:bg-black/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </motion.div>
            </div>

            {autoClose && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-bl-lg"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                onAnimationComplete={onClose}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}