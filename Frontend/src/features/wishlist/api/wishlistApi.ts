"use client";

import { api } from "@/shared/lib/axios";
import { AddToWishlistPayload, WishlistItem } from "../types";

export const getWishlist = async (): Promise<WishlistItem[]> => {
  const response = await api.get("/wishlist");
  return response.data;
};

export const addToWishlist = async (data: AddToWishlistPayload) => {
  const response = await api.post("/wishlist", data);
  return response.data;
};

export const removeFromWishlist = async (productId: number) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};
