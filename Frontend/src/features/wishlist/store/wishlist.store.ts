import { create } from "zustand";
import { WishlistItem, AddToWishlist, RemoveFromWishlist } from "../types";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (data: AddToWishlist) => Promise<void>;
  removeItem: (data: RemoveFromWishlist) => Promise<void>;
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
    const currentItems = get().items;

    if (currentItems.some((item) => item.productId === data.productId)) {
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

    try {
      await addToWishlist(data);
    } catch (error) {
      set({ items: currentItems });
      console.error("Failed to add item to wishlist:", error);
      throw error;
    }
  },

  removeItem: async (data) => {
    const currentItems = get().items;

    if (!currentItems.some((item) => item.productId === data.productId)) {
      return;
    }

    const updatedItems = currentItems.filter(
      (item) => item.productId !== data.productId
    );
    set({ items: updatedItems });

    try {
      await removeFromWishlist(data.productId);
    } catch (error) {
      set({ items: currentItems });
      console.error("Failed to remove item from wishlist:", error);
      throw error;
    }
  },

  clearWishlist: () => {
    set({ items: [] });
  },
}));
