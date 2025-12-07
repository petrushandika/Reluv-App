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

export const getSellerByUserId = async (userId: number): Promise<Store> => {
  try {
    const productsResponse = await api.get(`/products?sellerId=${userId}&limit=1000`);
    
    let products: any[] = [];
    if (productsResponse && productsResponse.data) {
      if (Array.isArray(productsResponse.data)) {
        products = productsResponse.data;
      } else if (productsResponse.data.data && Array.isArray(productsResponse.data.data)) {
        products = productsResponse.data.data;
      } else if (productsResponse.data.products && Array.isArray(productsResponse.data.products)) {
        products = productsResponse.data.products;
      }
    }
    
    if (!products || products.length === 0) {
      throw new Error("Seller not found or has no products");
    }

    const firstProduct = products[0];
    const sellerIdFromProduct = firstProduct.sellerId || userId;
    
    const seller = {
      id: sellerIdFromProduct,
      firstName: firstProduct.seller?.firstName || firstProduct.sellerId === userId ? "Seller" : "Seller",
      lastName: firstProduct.seller?.lastName || "",
    };

    const totalProducts = products.length;
    const totalSales = 0;
    
    const storeProducts: StoreProduct[] = products.map((p: any) => ({
      id: p.id,
      name: p.name || `Product #${p.id}`,
      slug: p.slug || `product-${p.id}`,
      description: p.description || null,
      images: Array.isArray(p.images) ? p.images : [],
      isPreloved: p.isPreloved || false,
      viewCount: p.viewCount || 0,
      createdAt: p.createdAt || new Date().toISOString(),
      variants: Array.isArray(p.variants) && p.variants.length > 0
        ? p.variants.map((v: any) => ({
            id: v.id,
            size: v.size || null,
            color: v.color || null,
            price: v.price || 0,
            compareAtPrice: v.compareAtPrice || null,
            stock: v.stock || 0,
            condition: v.condition || "NEW",
            image: v.image || null,
          }))
        : [],
    }));

    return {
      id: 0,
      name: `${seller.firstName} ${seller.lastName}`.trim() || "Seller",
      slug: `seller-${userId}`,
      isActive: true,
      isVerified: false,
      totalProducts,
      totalSales,
      rating: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: null,
      location: null,
      user: {
        id: seller.id,
        firstName: seller.firstName,
        lastName: seller.lastName,
      },
      products: storeProducts,
    };
  } catch (error) {
    const apiError = error as AxiosError<{ message?: string; error?: string }> | Error;
    
    if ("response" in apiError && apiError.response) {
      if (apiError.response.status === 404) {
        throw new Error("Seller not found or has no products");
      }
      const errorData = apiError.response.data as any;
      const errorMessage = errorData?.message || errorData?.error || "Unable to load seller";
      throw new Error(errorMessage);
    }
    
    const errorMessage = (apiError as Error).message || "Unable to load seller";
    
    if (errorMessage.includes("not found") || errorMessage.includes("no products")) {
      throw new Error("Seller not found or has no products");
    }
    
    throw new Error(errorMessage);
  }
};

