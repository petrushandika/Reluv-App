"use client";

import { api } from "@/shared/lib/axios";
import { Product, ProductQuery } from "../types";

export const getProducts = async (query?: ProductQuery): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>("/products", {
      params: query,
    });
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
    throw new Error("Tidak dapat memuat produk.");
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Gagal mengambil produk dengan ID ${id}:`, error);
    throw new Error("Tidak dapat memuat produk.");
  }
};
