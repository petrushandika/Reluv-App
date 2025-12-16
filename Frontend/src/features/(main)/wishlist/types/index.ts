import { Product } from "@/features/(main)/products/types";

export interface WishlistItem {
  id: number;
  productId: number;
  product: Product;
}

export interface AddToWishlist {
  productId: number;
}

export interface RemoveFromWishlist {
  productId: number;
}
