"use client";

import { api } from "@/shared/lib/axios";
import { Product, ProductQuery } from "../types";

export const getProducts = async (query?: ProductQuery): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>("/products", {
      params: query,
    });

    if (!response || !response.data) {
      console.warn("No data in response");
      return [];
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.warn("Response data is not an array:", response.data);
    return [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    if (!response || !response.data) {
      throw new Error("Product not found");
    }
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch product:", error);
    if (error.response?.status === 404) {
      throw new Error("Product not found");
    }
    throw new Error(error.message || "Unable to load product.");
  }
};
