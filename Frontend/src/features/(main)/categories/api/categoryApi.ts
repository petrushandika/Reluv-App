"use client";

import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  parentCategory?: Category | null;
  childCategories?: Category[];
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/categories");
    if (!response || !response.data) {
      return [];
    }
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const response = await api.get<Category>(`/categories/slug/${encodedSlug}`);
    if (!response || !response.data) {
      throw new Error("Category not found");
    }
    return response.data;
  } catch (error) {
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    if ("response" in apiError && apiError.response?.status === 404) {
      throw new Error("Category not found");
    }
    throw new Error(
      (apiError as Error).message || "Unable to load category."
    );
  }
};

export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await api.get<Category>(`/categories/${id}`);
    if (!response || !response.data) {
      throw new Error("Category not found");
    }
    return response.data;
  } catch (error) {
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    if ("response" in apiError && apiError.response?.status === 404) {
      throw new Error("Category not found");
    }
    throw new Error(
      (apiError as Error).message || "Unable to load category."
    );
  }
};
