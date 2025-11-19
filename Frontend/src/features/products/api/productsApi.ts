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

    if (!response || !response.data) {
      return [];
    }

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
    return [];
  } catch {
    return [];
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch {
    throw new Error("Unable to load product.");
  }
};
