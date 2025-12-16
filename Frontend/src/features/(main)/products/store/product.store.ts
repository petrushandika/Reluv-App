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
      const products = await getProducts({ ...query, sortBy: 'trending', limit: query?.limit || 10 });
      set({ trendingProducts: Array.isArray(products) ? products : [] });
    } catch (error) {
      set({ trendingProducts: [] });
    } finally {
      set({ isLoadingTrending: false });
    }
  },

  fetchSlashedPriceProducts: async (query) => {
    set({ isLoadingSlashed: true });
    try {
      const state = useProductStore.getState();
      const trendingIds = state.trendingProducts.map((p) => p.id);
      const products = await getProducts({ 
        ...query, 
        sortBy: 'slashed', 
        limit: query?.limit || 10,
        excludeIds: trendingIds.length > 0 ? trendingIds : undefined,
      });
      set({ slashedPriceProducts: Array.isArray(products) ? products : [] });
    } catch (error) {
      set({ slashedPriceProducts: [] });
    } finally {
      set({ isLoadingSlashed: false });
    }
  },

  fetchRecommendedProducts: async (query) => {
    set({ isLoadingRecommended: true });
    try {
      const state = useProductStore.getState();
      const trendingIds = state.trendingProducts.map((p) => p.id);
      const slashedIds = state.slashedPriceProducts.map((p) => p.id);
      const excludeIds = [...trendingIds, ...slashedIds];
      const products = await getProducts({ 
        ...query, 
        sortBy: 'recommended', 
        limit: query?.limit || 10,
        excludeIds: excludeIds.length > 0 ? excludeIds : undefined,
      });
      set({ recommendedProducts: Array.isArray(products) ? products : [] });
    } catch (error) {
      set({ recommendedProducts: [] });
    } finally {
      set({ isLoadingRecommended: false });
    }
  },
}));
