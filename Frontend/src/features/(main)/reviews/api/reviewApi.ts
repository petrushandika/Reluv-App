import { api } from "@/shared/lib/axios";
import { Review, CreateReviewData, UpdateReviewData, ReplyReviewData } from "../types";

export const getReviews = async (productId: number): Promise<Review[]> => {
  try {
    const response = await api.get<Review[]>(`/products/${productId}/reviews`);
    const reviews = Array.isArray(response.data) ? response.data : [];
    return reviews.map((review: any) => ({
      id: review.id || 0,
      rating: review.rating || 0,
      comment: review.comment || "",
      images: Array.isArray(review.images) ? review.images : [],
      reply: review.reply || undefined,
      editCount: review.editCount || 0,
      createdAt: review.createdAt || new Date().toISOString(),
      updatedAt: review.updatedAt || new Date().toISOString(),
      author: {
        id: review.author?.id || 0,
        firstName: review.author?.firstName || "",
        lastName: review.author?.lastName || "",
        profile: {
          avatar: review.author?.profile?.avatar || undefined,
        },
      },
      replyAuthor: review.replyAuthor
        ? {
            id: review.replyAuthor.id || 0,
            firstName: review.replyAuthor.firstName || "",
            lastName: review.replyAuthor.lastName || "",
            profile: {
              avatar: review.replyAuthor.profile?.avatar || undefined,
            },
          }
        : undefined,
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const getReview = async (productId: number, reviewId: number): Promise<Review> => {
  try {
    const response = await api.get<Review>(`/products/${productId}/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createReview = async (
  productId: number,
  data: CreateReviewData
): Promise<Review> => {
  try {
    const response = await api.post<Review>(`/products/${productId}/reviews`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReview = async (
  productId: number,
  reviewId: number,
  data: UpdateReviewData
): Promise<Review> => {
  try {
    const response = await api.patch<Review>(
      `/products/${productId}/reviews/${reviewId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const replyReview = async (
  productId: number,
  reviewId: number,
  data: ReplyReviewData
): Promise<Review> => {
  try {
    const response = await api.post<Review>(
      `/products/${productId}/reviews/${reviewId}/reply`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSellerReviews = async (): Promise<Review[]> => {
  try {
    const response = await api.get<Review[]>("/reviews/seller/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching seller reviews:", error);
    return [];
  }
};

export interface ReviewStats {
  totalReviews: number;
  avgRating: number;
  pendingReplies: number;
  ratingDistribution: Record<number, number>;
}

export const getSellerReviewStats = async (): Promise<ReviewStats> => {
  try {
    const response = await api.get<ReviewStats>("/reviews/seller/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching seller review stats:", error);
    throw error;
  }
};

