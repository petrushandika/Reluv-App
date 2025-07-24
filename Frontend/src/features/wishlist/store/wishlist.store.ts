import { create } from "zustand";
import { WishlistItem, AddToWishlistPayload } from "../types";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (data: AddToWishlistPayload) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: true,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await getWishlist();
      set({ items, isLoading: false });
    } catch (error) {
      console.error("Gagal mengambil data wishlist:", error);
      set({ isLoading: false, items: [] });
    }
  },

  addItem: async (data) => {
    try {
      await addToWishlist(data);
      await get().fetchWishlist();
    } catch (error) {
      console.error("Gagal menambah item ke wishlist:", error);
      throw error;
    }
  },

  removeItem: async (productId) => {
    try {
      await removeFromWishlist(productId);
      await get().fetchWishlist();
    } catch (error) {
      console.error("Gagal menghapus item dari wishlist:", error);
      throw error;
    }
  },

  clearWishlist: () => {
    set({ items: [] });
  },
}));
