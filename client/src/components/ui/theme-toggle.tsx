import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="glass hover:glass-strong transition-all duration-300 rounded-lg h-10 w-10 p-0 relative overflow-hidden"
      >
        <motion.div
          animate={{ 
            rotate: theme === "dark" ? 360 : 0,
            scale: theme === "dark" ? 0 : 1
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
