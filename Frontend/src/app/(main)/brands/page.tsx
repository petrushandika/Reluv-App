"use client";

import React from "react";
import ProductList from "@/features/(main)/products/components/ProductList";
import ReviewList from "@/features/(main)/reviews/components/ReviewList";
import Banner from "@/shared/components/organisms/Banner";
import Categories from "@/shared/components/organisms/Categories";
import Promotion from "@/shared/components/organisms/Promotion";
import { useProduct } from "@/features/(main)/products/hooks/useProduct";

export default function Brands() {
  const {
    trendingProducts,
    slashedPriceProducts,
    recommendedProducts,
    isLoadingTrending,
    isLoadingSlashed,
    isLoadingRecommended,
  } = useProduct();

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Banner />
      <Categories />
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Brands</h1>
      </div>
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

