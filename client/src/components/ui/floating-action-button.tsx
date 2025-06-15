import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps extends ButtonProps {
  icon: React.ReactNode;
  label?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showLabel?: boolean;
}

export function FloatingActionButton({
  icon,
  label,
  position = "bottom-right",
  showLabel = false,
  className,
  ...props
}: FloatingActionButtonProps) {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6", 
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6"
  };

  return (
    <motion.div
      className={cn("fixed z-50", positionClasses[position])}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        delay: 0.2 
      }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: [0, -4, 0],
          boxShadow: [
            "0 4px 15px rgba(0,0,0,0.1)",
            "0 8px 25px rgba(0,0,0,0.15)",
            "0 4px 15px rgba(0,0,0,0.1)"
          ]
        }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative group"
      >
        <Button
          className={cn(
            "w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl transition-all duration-300",
            className
          )}
          {...props}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            {icon}
          </motion.div>
        </Button>

        {label && (
          <motion.div
            initial={{ opacity: 0, x: position.includes("right") ? 10 : -10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none",
              position.includes("right") ? "right-16" : "left-16"
            )}
          >
            {label}
            <div 
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45",
                position.includes("right") ? "-right-1" : "-left-1"
              )}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}