"use client";

import { useEffect } from "react";
import { useProductStore } from "../store/product.store";
import { ProductQuery } from "../types";

export const useProduct = (query?: ProductQuery) => {
  const trendingProducts = useProductStore((state) => state.trendingProducts);
  const slashedPriceProducts = useProductStore(
    (state) => state.slashedPriceProducts
  );
  const recommendedProducts = useProductStore(
    (state) => state.recommendedProducts
  );
  const isLoadingTrending = useProductStore((state) => state.isLoadingTrending);
  const isLoadingSlashed = useProductStore((state) => state.isLoadingSlashed);
  const isLoadingRecommended = useProductStore(
    (state) => state.isLoadingRecommended
  );
  const fetchTrendingProducts = useProductStore(
    (state) => state.fetchTrendingProducts
  );
  const fetchSlashedPriceProducts = useProductStore(
    (state) => state.fetchSlashedPriceProducts
  );
  const fetchRecommendedProducts = useProductStore(
    (state) => state.fetchRecommendedProducts
  );

  useEffect(() => {
    const finalQuery = { limit: 10, ...query };

    fetchTrendingProducts(finalQuery);
    fetchSlashedPriceProducts(finalQuery);
    fetchRecommendedProducts(finalQuery);
  }, [
    fetchTrendingProducts,
    fetchSlashedPriceProducts,
    fetchRecommendedProducts,
    query?.categoryId,
  ]);

  return {
    trendingProducts,
    slashedPriceProducts,
    recommendedProducts,
    isLoadingTrending,
    isLoadingSlashed,
    isLoadingRecommended,
  };
};
