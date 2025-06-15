import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { WishlistHeart } from "@/components/wishlist-heart";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isAddingToCart } = useCart();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        quantity,
      });
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (error) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Product not found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button variant="ghost" className="glass hover:glass-strong">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <GlassCard className="p-8 animate-pulse">
              <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
            </GlassCard>
            
            <GlassCard className="p-8 animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6" />
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-6" />
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const discountPercentage = hasDiscount 
    ? Math.round(((parseFloat(product.originalPrice!) - parseFloat(product.price)) / parseFloat(product.originalPrice!)) * 100)
    : 0;

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" className="glass hover:glass-strong">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <GlassCard className="p-8">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-2xl"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {product.featured && (
                  <Badge className="bg-secondary text-secondary-foreground">
                    Bestseller
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge className="bg-red-500 text-white">
                    -{discountPercentage}%
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge variant="destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Product Info */}
          <GlassCard className="p-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {product.name}
              </h1>
              <WishlistHeart 
                productId={product.id} 
                className="glass hover:glass-strong"
                size="lg"
              />
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl font-bold text-primary">
                ${product.price}
              </span>
              {hasDiscount && (
                <span className="text-2xl text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Category and Tags */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
                {product.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Quantity:
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 p-0 glass hover:glass-strong"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseQuantity}
                  className="w-10 h-10 p-0 glass hover:glass-strong"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.inStock}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isAddingToCart ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding to Cart...</span>
                </div>
              ) : !product.inStock ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add {quantity} to Cart - ${(parseFloat(product.price) * quantity).toFixed(2)}
                </>
              )}
            </Button>
          </GlassCard>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
              Premium Quality
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Made from high-grade, non-toxic materials
            </p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
              Fast Shipping
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Free shipping on orders over $25
            </p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
              Customer Satisfaction
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              30-day return policy guaranteed
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
