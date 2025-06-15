import { Moon, Sun, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  // Get the effective theme for display purposes
  const getEffectiveTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  };

  const effectiveTheme = getEffectiveTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={cycleTheme}
        className="glass hover:glass-strong transition-all duration-300 rounded-lg h-10 w-10 p-0 relative overflow-hidden"
        title={`Current: ${theme} mode`}
      >
        {/* System theme icon */}
        <motion.div
          animate={{ 
            scale: theme === "system" ? 1 : 0,
            rotate: theme === "system" ? 0 : 180
          }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Monitor className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </motion.div>
        </motion.div>

        {/* Light theme icon */}
        <motion.div
          animate={{ 
            rotate: effectiveTheme === "dark" || theme === "system" ? 360 : 0,
            scale: theme === "light" ? 1 : 0
          }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sun className="h-4 w-4 text-yellow-500" />
          </motion.div>
        </motion.div>
        
        {/* Dark theme icon */}
        <motion.div
          animate={{ 
            rotate: theme === "dark" ? 0 : -360,
            scale: theme === "dark" ? 1 : 0
          }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, -360],
              y: [0, -2, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Moon className="h-4 w-4 text-blue-400" />
          </motion.div>
        </motion.div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
}
