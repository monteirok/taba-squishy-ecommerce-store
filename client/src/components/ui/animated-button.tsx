import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  animationType?: "bounce" | "scale" | "slide" | "pulse" | "rotate";
  children: React.ReactNode;
}

export function AnimatedButton({ 
  animationType = "scale", 
  children, 
  className,
  ...props 
}: AnimatedButtonProps) {
  const animationVariants = {
    bounce: {
      whileHover: { y: -2, transition: { type: "spring", stiffness: 300 } },
      whileTap: { y: 0, scale: 0.95 }
    },
    scale: {
      whileHover: { scale: 1.05, transition: { type: "spring", stiffness: 400 } },
      whileTap: { scale: 0.95 }
    },
    slide: {
      whileHover: { x: 5, transition: { type: "spring", stiffness: 300 } },
      whileTap: { x: 0, scale: 0.98 }
    },
    pulse: {
      whileHover: { 
        scale: [1, 1.05, 1], 
        transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" as const }
      },
      whileTap: { scale: 0.95 }
    },
    rotate: {
      whileHover: { 
        rotate: [0, 5, -5, 0], 
        transition: { duration: 0.3 }
      },
      whileTap: { scale: 0.95 }
    }
  };

  const currentAnimation = animationVariants[animationType];

  return (
    <motion.div
      whileHover={currentAnimation.whileHover}
      whileTap={currentAnimation.whileTap}
      className="inline-block"
    >
      <Button
        className={cn("transition-all duration-200", className)}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}