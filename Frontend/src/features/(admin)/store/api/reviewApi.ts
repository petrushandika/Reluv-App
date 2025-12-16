"use client";

import { api } from "@/shared/lib/axios";

export interface ReviewUser {
  id: number;
  firstName: string;
  lastName: string;
  profile: {
    avatar: string | null;
  } | null;
}

export interface ReviewProduct {
  id: number;
  name: string;
  slug: string;
  images: string[];
}

export interface StoreReview {
  id: number;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  editCount?: number;
  reply?: string | null;
  user: ReviewUser;
  product: ReviewProduct;
}

export interface StoreReviewsResponse {
  reviews: StoreReview[];
  total: number;
  averageRating: number;
}

export interface ProductReviewResponse {
  id: number;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    profile: {
      avatar: string | null;
    } | null;
  };
}

export const getProductReviews = async (productId: number): Promise<ProductReviewResponse[]> => {
  try {
    const response = await api.get<ProductReviewResponse[]>(`/products/${productId}/reviews`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
};

export const getStoreReviews = async (
  productIds: number[],
  products: Array<{ id: number; name: string; slug: string; images: string[] }>
): Promise<StoreReviewsResponse> => {
  try {
    const allReviews: StoreReview[] = [];
    
    for (const productId of productIds) {
      const reviews = await getProductReviews(productId);
      const product = products.find((p) => p.id === productId);
      
      if (product) {
        const storeReviews: StoreReview[] = reviews.map((review: any) => ({
          id: review.id,
          rating: review.rating || 0,
          comment: review.comment || "",
          images: Array.isArray(review.images) ? review.images : [],
          createdAt: review.createdAt || new Date().toISOString(),
          editCount: review.editCount || 0,
          reply: review.reply || null,
          user: {
            id: review.author?.id || 0,
            firstName: review.author?.firstName || "",
            lastName: review.author?.lastName || "",
            profile: review.author?.profile || null,
          },
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            images: product.images,
          },
        }));
        allReviews.push(...storeReviews);
      }
    }

    allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = allReviews.length;
    const averageRating = total > 0
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / total
      : 0;

    return {
      reviews: allReviews,
      total,
      averageRating,
    };
  } catch (error) {
    return { reviews: [], total: 0, averageRating: 0 };
  }
};

