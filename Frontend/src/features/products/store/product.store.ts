import { create } from "zustand";
import { Product, ProductQuery } from "../types";
import { getProducts } from "../api/productsApi";

interface ProductState {
  trendingProducts: Product[];
  slashedPriceProducts: Product[];
  recommendedProducts: Product[];
  isLoadingTrending: boolean;
  isLoadingSlashed: boolean;
  isLoadingRecommended: boolean;
  fetchTrendingProducts: (query?: ProductQuery) => Promise<void>;
  fetchSlashedPriceProducts: (query?: ProductQuery) => Promise<void>;
  fetchRecommendedProducts: (query?: ProductQuery) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  trendingProducts: [],
  slashedPriceProducts: [],
  recommendedProducts: [],
  isLoadingTrending: true,
  isLoadingSlashed: true,
  isLoadingRecommended: true,

  fetchTrendingProducts: async (query) => {
    set({ isLoadingTrending: true });
    try {
      const products = await getProducts(query);
      set({ trendingProducts: Array.isArray(products) ? products : [] });
    } catch (error) {
      console.error("Failed to fetch trending products:", error);
      set({ trendingProducts: [] });
    } finally {
      set({ isLoadingTrending: false });
    }
  },

  fetchSlashedPriceProducts: async (query) => {
    set({ isLoadingSlashed: true });
    try {
      const products = await getProducts(query);
      set({ slashedPriceProducts: Array.isArray(products) ? products : [] });
    } catch (error) {
      console.error("Failed to fetch discounted products:", error);
      set({ slashedPriceProducts: [] });
    } finally {
      set({ isLoadingSlashed: false });
    }
  },

  fetchRecommendedProducts: async (query) => {
    set({ isLoadingRecommended: true });
    try {
      const products = await getProducts(query);
      set({ recommendedProducts: Array.isArray(products) ? products : [] });
    } catch (error) {
      console.error("Failed to fetch recommended products:", error);
      set({ recommendedProducts: [] });
    } finally {
      set({ isLoadingRecommended: false });
    }
  },
}));
