"use client";

import React from "react";
import ProductList from "@/features/products/components/ProductList";
import ReviewList from "@/features/reviews/components/ReviewList";
import Banner from "@/shared/components/organisms/Banner";
import Categories from "@/shared/components/organisms/Categories";
import Promotion from "@/shared/components/organisms/Promotion";
import { useProduct } from "@/features/products/hooks/useProduct";

export default function Men() {
  const {
    trendingProducts,
    slashedPriceProducts,
    recommendedProducts,
    isLoadingTrending,
    isLoadingSlashed,
    isLoadingRecommended,
  } = useProduct({ categoryId: 2 });

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Banner />
      <Categories />
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
      <ReviewList />
      <Promotion />
    </div>
  );
}
