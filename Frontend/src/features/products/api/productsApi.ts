"use client";

import { api } from "@/shared/lib/axios";
import { Product, ProductQuery } from "../types";
import { AxiosError } from "axios";

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

export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const response = await api.get<Product>(`/products/slug/${encodedSlug}`);
    if (!response || !response.data) {
      throw new Error("Product not found");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product by slug:", slug, error);
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    if ("response" in apiError && apiError.response?.status === 404) {
      throw new Error("Product not found");
    }
    throw new Error(
      (apiError as Error).message || "Unable to load product."
    );
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    if (!response || !response.data) {
      throw new Error("Product not found");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    if ("response" in apiError && apiError.response?.status === 404) {
      throw new Error("Product not found");
    }
    throw new Error(
      (apiError as Error).message || "Unable to load product."
    );
  }
};

export const getMyProducts = async (query?: ProductQuery): Promise<Product[]> => {
  try {
    const response = await api.get<{ data: Product[] }>("/products/me", {
      params: { ...query, page: query?.page || 1, limit: query?.limit || 100 },
    });

    if (!response || !response.data) {
      console.warn("No data in response");
      return [];
    }

    const products = response.data.data || response.data;
    
    if (Array.isArray(products)) {
      return products;
    }

    console.warn("Response data is not an array:", products);
    return [];
  } catch (error) {
    console.error("Failed to fetch my products:", error);
    return [];
  }
};

export interface UpdateProductPayload {
  name?: string;
  slug?: string;
  description?: string;
  images?: string[];
  isPublished?: boolean;
  isPreloved?: boolean;
  categoryId?: number;
  parentCategoryId?: number;
  childCategoryId?: number;
}

export const updateProduct = async (
  id: number,
  payload: UpdateProductPayload
): Promise<Product> => {
  try {
    const response = await api.patch<Product>(`/products/${id}`, payload);
    if (!response || !response.data) {
      throw new Error("Failed to update product");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to update product:", error);
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    throw new Error(
      (apiError as Error).message || "Unable to update product."
    );
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error("Failed to delete product:", error);
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    throw new Error(
      (apiError as Error).message || "Unable to delete product."
    );
  }
};

export interface UpdateVariantPayload {
  size?: string;
  color?: string;
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  condition?: string;
  conditionNote?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

export const updateProductVariant = async (
  productId: number,
  variantId: number,
  payload: UpdateVariantPayload
): Promise<void> => {
  try {
    await api.patch(`/products/${productId}/variants/${variantId}`, payload);
  } catch (error) {
    console.error("Failed to update variant:", error);
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    throw new Error(
      (apiError as Error).message || "Unable to update variant."
    );
  }
};

export const deleteProductVariant = async (
  productId: number,
  variantId: number
): Promise<void> => {
  try {
    await api.delete(`/products/${productId}/variants/${variantId}`);
  } catch (error) {
    console.error("Failed to delete variant:", error);
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    throw new Error(
      (apiError as Error).message || "Unable to delete variant."
    );
  }
};

export const updateProductPrice = async (
  productId: number,
  variantId: number,
  price: number
): Promise<void> => {
  try {
    await api.patch(`/products/${productId}/variants/${variantId}`, { price });
  } catch (error) {
    console.error("Failed to update product price:", error);
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    throw new Error(
      (apiError as Error).message || "Unable to update product price."
    );
  }
};

export const updateProductStock = async (
  productId: number,
  variantId: number,
  stock: number
): Promise<void> => {
  try {
    await api.patch(`/products/${productId}/variants/${variantId}`, { stock });
  } catch (error) {
    console.error("Failed to update product stock:", error);
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    throw new Error(
      (apiError as Error).message || "Unable to update product stock."
    );
  }
};

export const toggleProductStatus = async (
  productId: number,
  isActive: boolean
): Promise<Product> => {
  try {
    const response = await api.patch<Product>(`/products/${productId}`, {
      isActive: isActive,
    });
    if (!response || !response.data) {
      throw new Error("Failed to update product status");
    }
    return response.data;
  } catch (error) {
    console.error("Failed to toggle product status:", error);
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    throw new Error(
      (apiError as Error).message || "Unable to update product status."
    );
  }
};