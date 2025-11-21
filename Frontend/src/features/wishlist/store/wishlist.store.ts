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
  isLoading: true,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await getWishlist();
      if (Array.isArray(items)) {
        set({ items, isLoading: false });
      } else {
        set({ isLoading: false, items: [] });
      }
    } catch (error) {
      console.error("Failed to fetch wishlist data:", error);
      set({ isLoading: false, items: [] });
    }
  },

  addItem: async (data) => {
    const currentItems = get().items;

    if (
      currentItems.some(
        (item) => (item.productId || item.product?.id) === data.productId
      )
    ) {
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
      console.error("Failed to add item to wishlist:", error);
      set({ items: currentItems });
      throw error;
    }
  },

  removeItem: async (data) => {
    const currentItems = get().items;

    const itemToRemove = currentItems.find(
      (item) => (item.productId || item.product?.id) === data.productId
    );

    if (!itemToRemove) {
      return;
    }

    const updatedItems = currentItems.filter(
      (item) => (item.productId || item.product?.id) !== data.productId
    );
    set({ items: updatedItems });

    try {
      await removeFromWishlist(data.productId);
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
      set({ items: currentItems });
      throw error;
    }
  },

  clearWishlist: () => {
    set({ items: [] });
  },
}));
