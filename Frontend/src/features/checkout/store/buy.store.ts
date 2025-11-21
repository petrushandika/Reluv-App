import { create } from "zustand";

interface BuyItem {
  variantId: number;
  productId: number;
  productName: string;
  productImage: string;
  variantPrice: number;
  variantSize?: string;
  variantColor?: string;
  quantity: number;
}

interface BuyState {
  item: BuyItem | null;
  setBuyItem: (item: BuyItem) => void;
  clearBuyItem: () => void;
}

export const useBuyStore = create<BuyState>((set) => ({
  item: null,
  setBuyItem: (item) => set({ item }),
  clearBuyItem: () => set({ item: null }),
}));

