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
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await getWishlist();
      set({ items, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch wishlist data:", error);
      set({ isLoading: false, items: [] });
    }
  },

  addItem: async (data) => {
    try {
      const currentItems = get().items;
      if (currentItems.some((item) => item.productId === data.productId)) {
        await get().fetchWishlist();
        return;
      }
      const newItem: WishlistItem = {
        id: Date.now(),
        productId: data.productId,
        product: {
          id: 0,
          name: "",
          description: "",
          storeId: 0,
          createdAt: "",
          updatedAt: "",
        } as WishlistItem["product"],
      };
      set({ items: [...currentItems, newItem] });

      await addToWishlist(data);
      await get().fetchWishlist();
    } catch (error) {
      await get().fetchWishlist();
      console.error("Failed to add item to wishlist:", error);
      throw error;
    }
  },

  removeItem: async (productId) => {
    try {
      const currentItems = get().items;
      set({
        items: currentItems.filter((item) => item.productId !== productId),
      });

      await removeFromWishlist(productId);
      await get().fetchWishlist();
    } catch (error) {
      await get().fetchWishlist();
      console.error("Failed to remove item from wishlist:", error);
      throw error;
    }
  },

  clearWishlist: () => {
    set({ items: [] });
  },
}));
