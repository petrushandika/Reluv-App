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

export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const response = await api.get<Product>(`/products/slug/${encodedSlug}`);
    if (!response || !response.data) {
      throw new Error("Product not found");
    }
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch product by slug:", slug, error);
    if (error.response?.status === 404) {
      throw new Error("Product not found");
    }
    throw new Error(error.message || "Unable to load product.");
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

export const getMyProducts = async (query?: ProductQuery): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>("/products", {
      params: { ...query, page: query?.page || 1, limit: query?.limit || 100 },
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
  } catch (error: any) {
    console.error("Failed to update product:", error);
    throw new Error(error.message || "Unable to update product.");
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    throw new Error(error.message || "Unable to delete product.");
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
  } catch (error: any) {
    console.error("Failed to update variant:", error);
    throw new Error(error.message || "Unable to update variant.");
  }
};

export const deleteProductVariant = async (
  productId: number,
  variantId: number
): Promise<void> => {
  try {
    await api.delete(`/products/${productId}/variants/${variantId}`);
  } catch (error: any) {
    console.error("Failed to delete variant:", error);
    throw new Error(error.message || "Unable to delete variant.");
  }
};

export const updateProductPrice = async (
  productId: number,
  variantId: number,
  price: number
): Promise<void> => {
  try {
    await api.patch(`/products/${productId}/variants/${variantId}`, { price });
  } catch (error: any) {
    console.error("Failed to update product price:", error);
    throw new Error(error.message || "Unable to update product price.");
  }
};

export const updateProductStock = async (
  productId: number,
  variantId: number,
  stock: number
): Promise<void> => {
  try {
    await api.patch(`/products/${productId}/variants/${variantId}`, { stock });
  } catch (error: any) {
    console.error("Failed to update product stock:", error);
    throw new Error(error.message || "Unable to update product stock.");
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
  } catch (error: any) {
    console.error("Failed to toggle product status:", error);
    throw new Error(error.message || "Unable to update product status.");
  }
};