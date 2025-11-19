"use client";

import React from "react";
import ProductList from "@/features/products/components/ProductList";
import ReviewList from "@/features/reviews/components/ReviewList";
import Banner from "@/shared/components/organisms/Banner";
import Categories from "@/shared/components/organisms/Categories";
import Promotion from "@/shared/components/organisms/Promotion";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useParams } from "next/navigation";

export default function MenCategory() {
  const params = useParams();
  const category = params?.category as string;
  
  const {
    trendingProducts,
    slashedPriceProducts,
    recommendedProducts,
    isLoadingTrending,
    isLoadingSlashed,
    isLoadingRecommended,
  } = useProduct({ categoryId: 2 });

  // Convert slug back to readable format
  const categoryTitle = category
    ? category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Men";

  return (
    <div>
      <Banner />
      <Categories />
      <div className="container mx-auto px-6 md:px-20 xl:px-40 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{categoryTitle}</h1>
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

