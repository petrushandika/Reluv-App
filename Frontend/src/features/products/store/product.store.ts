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
      set({ trendingProducts: products });
    } catch (error) {
      console.error("Gagal mengambil produk trending:", error);
    } finally {
      set({ isLoadingTrending: false });
    }
  },

  fetchSlashedPriceProducts: async (query) => {
    set({ isLoadingSlashed: true });
    try {
      const products = await getProducts(query);
      set({ slashedPriceProducts: products });
    } catch (error) {
      console.error("Gagal mengambil produk diskon:", error);
    } finally {
      set({ isLoadingSlashed: false });
    }
  },

  fetchRecommendedProducts: async (query) => {
    set({ isLoadingRecommended: true });
    try {
      const products = await getProducts(query);
      set({ recommendedProducts: products });
    } catch (error) {
      console.error("Gagal mengambil produk rekomendasi:", error);
    } finally {
      set({ isLoadingRecommended: false });
    }
  },
}));
