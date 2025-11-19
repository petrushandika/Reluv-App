"use client";

import { api } from "@/shared/lib/axios";
import { Product, ProductQuery } from "../types";

export const getProducts = async (query?: ProductQuery): Promise<Product[]> => {
  try {
    const response = await api.get<Product[] | { data: Product[] }>(
      "/products",
      {
        params: query,
      }
    );
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (
      data &&
      typeof data === "object" &&
      "data" in data &&
      Array.isArray(data.data)
    ) {
      return data.data;
    }
    console.warn("Unexpected API response structure:", data);
    return [];
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
    return [];
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
