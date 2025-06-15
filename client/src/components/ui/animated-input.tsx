import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, success, icon, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <motion.label
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none text-gray-500 dark:text-gray-400",
              isFocused || hasValue
                ? "top-2 text-xs text-primary"
                : "top-1/2 -translate-y-1/2 text-sm"
            )}
            animate={{
              y: isFocused || hasValue ? 0 : 0,
              scale: isFocused || hasValue ? 0.85 : 1,
              color: isFocused ? "rgb(139, 92, 246)" : error ? "rgb(239, 68, 68)" : "rgb(107, 114, 128)"
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon && (
            <motion.div 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              animate={{ 
                color: isFocused ? "rgb(139, 92, 246)" : error ? "rgb(239, 68, 68)" : "rgb(156, 163, 175)"
              }}
            >
              {icon}
            </motion.div>
          )}
          
          <Input
            ref={ref}
            className={cn(
              "transition-all duration-300 border-2",
              label && "pt-6 pb-2",
              icon && "pl-10",
              error && "border-red-500 focus:border-red-500",
              success && "border-green-500 focus:border-green-500",
              !error && !success && "focus:border-primary",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: isFocused ? "100%" : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {error && (
          <motion.p
            className="text-red-500 text-sm mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}

        {success && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";