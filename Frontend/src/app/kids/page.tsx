"use client";

import React, { useState, useEffect } from "react";
import ProductList from "@/features/products/components/ProductList";
import CategoryHero from "@/shared/components/organisms/CategoryHero";
import { useProduct } from "@/features/products/hooks/useProduct";
import { getCategoryBySlug } from "@/features/categories/api/categoryApi";
import { Category } from "@/features/categories/api/categoryApi";

export default function Kids() {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getCategoryBySlug("kids");
        setCategory(categoryData);
      } catch (error) {
        setCategory({ id: 4, name: "Kids", slug: "kids" });
      } finally {
        setIsLoadingCategory(false);
      }
    };
    fetchCategory();
  }, []);

  const {
    trendingProducts,
    slashedPriceProducts,
    recommendedProducts,
    isLoadingTrending,
    isLoadingSlashed,
    isLoadingRecommended,
  } = useProduct({ categoryId: category?.id || 4 });

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-10">
        {!isLoadingCategory && (
          <CategoryHero
            title={category?.name || "Kids"}
            description={`Find the perfect outfits for your little ones. Discover trendy and comfortable kids' clothing with fun designs and premium quality.`}
            categorySlug="kids"
          />
        )}
        
        <ProductList
          title="Trending Now"
          products={trendingProducts}
          isLoading={isLoadingTrending}
        />
        <ProductList
          title="Slashed Prices"
          products={slashedPriceProducts}
          isLoading={isLoadingSlashed}
        />
        <ProductList
          title="Recommended"
          products={recommendedProducts}
          isLoading={isLoadingRecommended}
        />
      </div>
    </div>
  );
}
