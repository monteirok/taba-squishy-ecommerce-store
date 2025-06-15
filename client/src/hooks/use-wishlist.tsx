import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { WishlistItemWithProduct } from "@shared/schema";

export function useWishlist() {
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["/api/wishlist"],
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      return await apiRequest("POST", "/api/wishlist", { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      return await apiRequest("DELETE", `/api/wishlist/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
  });

  const checkWishlistQuery = (productId: number) => useQuery<{ isInWishlist: boolean }>({
    queryKey: ["/api/wishlist/check", productId],
    enabled: !!productId,
  });

  return {
    wishlistItems: wishlistItems as WishlistItemWithProduct[],
    isLoading,
    addToWishlist: addToWishlistMutation.mutateAsync,
    removeFromWishlist: removeFromWishlistMutation.mutateAsync,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
    checkWishlistQuery,
  };
}