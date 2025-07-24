import { create } from "zustand";
import { Cart, AddToCartPayload, UpdateCartItemPayload } from "../types";
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
} from "../api/cartApi";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  fetchCart: () => Promise<void>;
  addItem: (data: AddToCartPayload) => Promise<void>;
  updateItemQuantity: (
    itemId: number,
    data: UpdateCartItemPayload
  ) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: true,
  itemCount: 0,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cartData = await getCart();
      set({
        cart: cartData,
        itemCount: cartData.items.reduce((sum, item) => sum + item.quantity, 0),
        isLoading: false,
      });
    } catch (error) {
      console.error("Gagal mengambil data keranjang:", error);
      set({ isLoading: false, cart: null, itemCount: 0 });
    }
  },

  addItem: async (data) => {
    try {
      await addToCart(data);
      await get().fetchCart();
    } catch (error) {
      console.error("Gagal menambah item ke keranjang:", error);
      throw error;
    }
  },

  updateItemQuantity: async (itemId, data) => {
    try {
      await updateCartItem(itemId, data);
      await get().fetchCart();
    } catch (error) {
      console.error("Gagal memperbarui item keranjang:", error);
      throw error;
    }
  },

  removeItem: async (itemId) => {
    try {
      await deleteCartItem(itemId);
      await get().fetchCart();
    } catch (error) {
      console.error("Gagal menghapus item dari keranjang:", error);
      throw error;
    }
  },

  clearCart: () => {
    set({ cart: null, itemCount: 0 });
  },
}));
