import { Product, Variant } from "@/features/products/types";

export interface CartItem {
  id: number;
  variantId: number;
  quantity: number;
  variant: Variant & {
    product: Product;
  };
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface AddToCartPayload {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
