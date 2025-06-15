import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/search/search-dialog";

export function FloatingSearchButton() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Search button clicked");
    setIsSearchOpen(true);
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleSearchClick}
          className="h-14 w-14 rounded-full glass hover:glass-strong transition-all duration-300 shadow-lg hover:shadow-xl relative z-10"
          size="lg"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              rotate: [0, -15, 15, 0],
              transition: { duration: 0.4 },
            }}
          >
            <Search className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </motion.div>
        </Button>

        {/* Pulsing ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30 pointer-events-none -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}