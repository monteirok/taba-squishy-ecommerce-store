import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@shared/schema";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categories = [
    { value: "all", label: "All Products" },
    { value: "kawaii", label: "Kawaii" },
    { value: "stress-relief", label: "Stress Relief" },
    { value: "fidget", label: "Fidget" },
    { value: "food", label: "Food" },
    { value: "therapy", label: "Therapy" },
    { value: "sets", label: "Sets" },
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "featured", label: "Featured" },
  ];

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (error) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We couldn't load the products. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Our Products
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Discover our complete collection of premium squishy toys
          </p>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass border-0 focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={
                    selectedCategory === category.value
                      ? "bg-primary text-primary-foreground"
                      : "glass hover:glass-strong"
                  }
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 glass rounded-lg border-0 focus:ring-2 focus:ring-primary text-gray-800 dark:text-white bg-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </GlassCard>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <GlassCard key={i} className="p-6 animate-pulse">
                <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
              </GlassCard>
            ))}
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 glass rounded-3xl flex items-center justify-center">
              <Search className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSortBy("name");
              }}
              variant="outline"
              className="glass-strong hover:glass"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
