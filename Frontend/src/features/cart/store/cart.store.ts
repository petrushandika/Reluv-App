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
  isLoading: false,
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
      console.error("Failed to fetch cart data:", error);
      set({ isLoading: false, cart: null, itemCount: 0 });
    }
  },

  addItem: async (data) => {
    try {
      const currentCount = get().itemCount;
      set({ itemCount: currentCount + (data.quantity || 1) });

      await addToCart(data);
      await get().fetchCart();
    } catch (error) {
      await get().fetchCart();
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  },

  updateItemQuantity: async (itemId, data) => {
    try {
      const currentCart = get().cart;
      if (currentCart) {
        const item = currentCart.items.find((i) => i.id === itemId);
        if (item) {
          const oldQuantity = item.quantity;
          const newQuantity = data.quantity || item.quantity;
          const diff = newQuantity - oldQuantity;
          const currentCount = get().itemCount;
          set({ itemCount: Math.max(0, currentCount + diff) });
        }
      }

      await updateCartItem(itemId, data);
      await get().fetchCart();
    } catch (error) {
      await get().fetchCart();
      console.error("Failed to update cart item:", error);
      throw error;
    }
  },

  removeItem: async (itemId) => {
    try {
      const currentCart = get().cart;
      if (currentCart) {
        const item = currentCart.items.find((i) => i.id === itemId);
        if (item) {
          const currentCount = get().itemCount;
          set({ itemCount: Math.max(0, currentCount - item.quantity) });
        }
      }

      await deleteCartItem(itemId);
      await get().fetchCart();
    } catch (error) {
      await get().fetchCart();
      console.error("Failed to remove item from cart:", error);
      throw error;
    }
  },

  clearCart: () => {
    set({ cart: null, itemCount: 0 });
  },
}));
