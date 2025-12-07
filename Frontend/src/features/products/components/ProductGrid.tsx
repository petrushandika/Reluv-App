"use client";

import React, { useState } from "react";
import { Product } from '@/features/products/types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from '@/shared/components/molecules/ProductCardSkeleton';
import { ChevronRight } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  initialLimit?: number;
  showSeeMore?: boolean;
  onSeeMoreClick?: () => void;
}

const ProductGrid = ({
  products,
  isLoading,
  initialLimit = 20,
  showSeeMore = true,
  onSeeMoreClick,
}: ProductGridProps) => {
  const [showAll, setShowAll] = useState(false);
  const safeProducts = Array.isArray(products) ? products : [];
  const displayedProducts = showAll ? safeProducts : safeProducts.slice(0, initialLimit);
  const hasMore = safeProducts.length > initialLimit;

  const handleSeeMore = () => {
    if (onSeeMoreClick) {
      onSeeMoreClick();
    } else {
      setShowAll(true);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: initialLimit }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (safeProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          No products found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {showSeeMore && hasMore && !showAll && (
        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={handleSeeMore}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 text-sm sm:text-base shadow-md hover:shadow-lg"
          >
            See More
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

