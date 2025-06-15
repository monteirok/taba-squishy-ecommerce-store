import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedLoaderProps {
  type?: "spinner" | "dots" | "pulse" | "bounce";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AnimatedLoader({ 
  type = "spinner", 
  size = "md", 
  className 
}: AnimatedLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3"
  };

  if (type === "spinner") {
    return (
      <motion.div
        className={cn(
          "border-2 border-gray-200 border-t-primary rounded-full",
          sizeClasses[size],
          className
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );
  }

  if (type === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn(
              "bg-primary rounded-full",
              dotSizes[size]
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "pulse") {
    return (
      <motion.div
        className={cn(
          "bg-primary rounded-full",
          sizeClasses[size],
          className
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  }

  if (type === "bounce") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn(
              "bg-primary rounded-full",
              dotSizes[size]
            )}
            animate={{
              y: [0, -8, 0]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}

// Animated skeleton component for loading states
interface AnimatedSkeletonProps {
  className?: string;
  variant?: "text" | "circle" | "rectangle";
}

export function AnimatedSkeleton({ 
  className, 
  variant = "rectangle" 
}: AnimatedSkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700";
  
  const variantClasses = {
    text: "h-4 w-full rounded",
    circle: "rounded-full",
    rectangle: "rounded-md"
  };

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: "200% 100%"
      }}
    />
  );
}