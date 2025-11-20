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
    console.log("[Wishlist Store] fetchWishlist called");
    set({ isLoading: true });
    try {
      const items = await getWishlist();
      console.log("[Wishlist Store] fetchWishlist success, items:", items);
      set({ items, isLoading: false });
    } catch (error) {
      console.error("[Wishlist Store] Failed to fetch wishlist data:", error);
      set({ isLoading: false, items: [] });
    }
  },

  addItem: async (data) => {
    console.log("[Wishlist Store] addItem called with:", data);
    const currentItems = get().items;
    console.log("[Wishlist Store] currentItems:", currentItems);

    if (
      currentItems.some(
        (item) => (item.productId || item.product?.id) === data.productId
      )
    ) {
      console.log("[Wishlist Store] Item already exists, skipping");
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

    console.log("[Wishlist Store] Adding new item optimistically:", newItem);
    set({ items: [...currentItems, newItem] });
    console.log(
      "[Wishlist Store] State updated, new items count:",
      get().items.length
    );

    try {
      await addToWishlist(data);
      console.log("[Wishlist Store] addItem API success");
    } catch (error) {
      console.error("[Wishlist Store] Failed to add item to wishlist:", error);
      set({ items: currentItems });
      throw error;
    }
  },

  removeItem: async (data) => {
    console.log("[Wishlist Store] removeItem called with:", data);
    const currentItems = get().items;
    console.log("[Wishlist Store] currentItems before remove:", currentItems);

    const itemToRemove = currentItems.find(
      (item) => (item.productId || item.product?.id) === data.productId
    );

    if (!itemToRemove) {
      console.log("[Wishlist Store] Item not found in wishlist, skipping");
      return;
    }

    const updatedItems = currentItems.filter(
      (item) => (item.productId || item.product?.id) !== data.productId
    );
    console.log(
      "[Wishlist Store] Removing item optimistically, updatedItems:",
      updatedItems
    );
    set({ items: updatedItems });
    console.log(
      "[Wishlist Store] State updated, new items count:",
      get().items.length
    );

    try {
      console.log(
        "[Wishlist Store] Calling API to remove productId:",
        data.productId
      );
      await removeFromWishlist(data.productId);
      console.log("[Wishlist Store] removeItem API success");
    } catch (error) {
      console.error(
        "[Wishlist Store] Failed to remove item from wishlist:",
        error
      );
      set({ items: currentItems });
      throw error;
    }
  },

  clearWishlist: () => {
    set({ items: [] });
  },
}));
