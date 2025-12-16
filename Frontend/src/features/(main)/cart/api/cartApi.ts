"use client";

import { api } from "@/shared/lib/axios";
import { AddToCartPayload, UpdateCartItemPayload, Cart } from "../types";

export const getCart = async (): Promise<Cart> => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async (data: AddToCartPayload) => {
  const response = await api.post("/cart/items", data);
  return response.data;
};

export const updateCartItem = async (
  itemId: number,
  data: UpdateCartItemPayload
) => {
  const response = await api.patch(`/cart/items/${itemId}`, data);
  return response.data;
};

export const deleteCartItem = async (itemId: number) => {
  const response = await api.delete(`/cart/items/${itemId}`);
  return response.data;
};
