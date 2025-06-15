import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WishlistHeartProps {
  productId: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function WishlistHeart({ productId, className, size = "md" }: WishlistHeartProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { addToWishlist, removeFromWishlist, checkWishlistQuery } = useWishlist();
  const { toast } = useToast();
  
  const { data: wishlistStatus } = checkWishlistQuery(productId);
  const isInWishlist = wishlistStatus?.isInWishlist || false;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  const handleToggleWishlist = async () => {
    try {
      setIsAnimating(true);
      
      if (isInWishlist) {
        await removeFromWishlist(productId);
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist",
        });
      } else {
        await addToWishlist(productId);
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Keep animation running for a bit longer for visual feedback
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "p-2 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950 transition-all duration-200",
        className
      )}
      onClick={handleToggleWishlist}
    >
      <Heart
        className={cn(
          sizeClasses[size],
          "transition-all duration-300 ease-out",
          isInWishlist 
            ? "fill-pink-500 text-pink-500" 
            : "text-gray-400 hover:text-pink-400",
          isAnimating && [
            "animate-pulse scale-125",
            isInWishlist 
              ? "animate-bounce fill-pink-600 text-pink-600" 
              : "text-pink-500"
          ]
        )}
      />
    </Button>
  );
}