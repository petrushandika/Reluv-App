"use client";

import { api } from "@/shared/lib/axios";
import { AddToWishlist, WishlistItem } from "../types";

export const getWishlist = async (): Promise<WishlistItem[]> => {
  const response = await api.get("/wishlist");
  return response.data;
};

export const addToWishlist = async (data: AddToWishlist) => {
  const response = await api.post(`/wishlist/${data.productId}`);
  return response.data;
};

export const removeFromWishlist = async (productId: number) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};
