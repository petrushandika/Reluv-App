import { Product } from "@/features/products/types";

export interface WishlistItem {
  id: number;
  productId: number;
  product: Product;
}

export interface AddToWishlistPayload {
  productId: number;
}
