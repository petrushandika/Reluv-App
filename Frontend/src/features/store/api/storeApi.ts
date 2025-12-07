"use client";

import { api } from "@/shared/lib/axios";
import { AxiosError } from "axios";

export interface StoreProfile {
  id: number;
  avatar: string | null;
  banner: string | null;
  bio: string | null;
  operational: string | null;
}

export interface StoreLocation {
  id: number;
  city: string | null;
  province: string | null;
  district: string | null;
  subDistrict: string | null;
}

export interface StoreUser {
  id: number;
  firstName: string;
  lastName: string;
}

export interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  images: string[];
  isPreloved: boolean;
  viewCount: number;
  createdAt: string;
  variants: Array<{
    id: number;
    size: string | null;
    color: string | null;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    condition: string;
    image: string | null;
  }>;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  isVerified: boolean;
  totalProducts: number;
  totalSales: number;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  profile: StoreProfile | null;
  location: StoreLocation | null;
  user: StoreUser;
  products: StoreProduct[];
}

export const getStoreBySlug = async (slug: string): Promise<Store> => {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const response = await api.get<Store>(`/store/${encodedSlug}`);
    if (!response || !response.data) {
      throw new Error("Store not found");
    }
    return response.data;
  } catch (error) {
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    if ("response" in apiError && apiError.response?.status === 404) {
      throw new Error("Store not found");
    }
    throw new Error(
      (apiError as Error).message || "Unable to load store."
    );
  }
};

