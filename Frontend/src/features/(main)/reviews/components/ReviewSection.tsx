"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MessageSquare, Plus } from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { getReviews, createReview, updateReview, replyReview } from "../api/reviewApi";
import { Review, CreateReviewData, UpdateReviewData, ReplyReviewData } from "../types";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { toast } from "sonner";

interface ReviewSectionProps {
  productId: number;
  productSlug?: string;
  productSellerId?: number;
  productStoreId?: number;
  orderId?: number;
}

const ReviewSection = ({
  productId,
  productSlug,
  productSellerId,
  productStoreId,
  orderId,
}: ReviewSectionProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [replyingToReview, setReplyingToReview] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [userStoreId, setUserStoreId] = useState<number | null>(null);
  const [userOrderId, setUserOrderId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchUserStore = async () => {
      if (user?.id && isAuthenticated()) {
        try {
          const { api } = await import("@/shared/lib/axios");
          const response = await api.get("/store/me/my-store");
          if (response.data && response.data.id) {
            setUserStoreId(response.data.id);
          }
        } catch (error) {
          setUserStoreId(null);
        }
      }
    };
    fetchUserStore();
  }, [user?.id, isAuthenticated]);

  useEffect(() => {
    const fetchUserOrder = async () => {
      if (user?.id && isAuthenticated() && productId > 0) {
        try {
          const { api } = await import("@/shared/lib/axios");
          const response = await api.get("/orders");
          const orders = Array.isArray(response.data) 
            ? response.data 
            : (response.data?.data && Array.isArray(response.data.data) 
              ? response.data.data 
              : []);
          
          const validOrder = orders.find((o: any) => {
            const isDeliveredOrCompleted = o.status === "DELIVERED" || o.status === "COMPLETED";
            const hasProduct = o.items?.some((item: any) => 
              item.variant?.product?.id === productId
            );
            return isDeliveredOrCompleted && hasProduct;
          });
          
          if (validOrder) {
            setUserOrderId(validOrder.id);
          } else {
            setUserOrderId(undefined);
          }
        } catch (error) {
          setUserOrderId(undefined);
        }
      } else {
        setUserOrderId(undefined);
      }
    };
    fetchUserOrder();
  }, [user?.id, isAuthenticated, productId]);

  const isStoreOwner = userStoreId !== null && productStoreId === userStoreId;
  const userReview = reviews.find((r) => r.author.id === user?.id);
  const effectiveOrderId = orderId || userOrderId;
  const canReview = isAuthenticated() && !userReview && effectiveOrderId;

  useEffect(() => {
    if (productId > 0) {
      fetchReviews();
    } else {
      setIsLoading(false);
      setReviews([]);
    }
  }, [productId]);

  const fetchReviews = async () => {
    if (!productId || productId <= 0) return;
    
    setIsLoading(true);
    try {
      const data = await getReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReview = async (data: CreateReviewData) => {
    try {
      const newReview = await createReview(productId, data);
      setReviews([newReview, ...reviews]);
      setShowForm(false);
      toast.success("Review submitted successfully!");
    } catch (error: any) {
      throw error;
    }
  };

  const handleUpdateReview = async (data: UpdateReviewData) => {
    if (!editingReview) return;

    try {
      const updatedReview = await updateReview(productId, editingReview.id, data);
      setReviews(
        reviews.map((r) => (r.id === updatedReview.id ? updatedReview : r))
      );
      setEditingReview(null);
      toast.success("Review updated successfully!");
    } catch (error: any) {
      throw error;
    }
  };

  const handleReply = async (reviewId: number) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const updatedReview = await replyReview(productId, reviewId, {
        reply: replyText.trim(),
      });
      setReviews(
        reviews.map((r) => (r.id === updatedReview.id ? updatedReview : r))
      );
      setReplyingToReview(null);
      setReplyText("");
      toast.success("Reply posted successfully!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "Failed to post reply"
      );
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === rating).length / reviews.length) *
          100
        : 0,
  }));

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
          Reviews
        </h2>

          {reviews.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-6">
              <div className="shrink-0">
                <div className="text-left sm:text-left">
                  <div className="flex items-center justify-start sm:justify-start gap-2 mb-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                      {averageRating.toFixed(1)}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1 w-14 sm:w-16 md:w-20">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        {rating}
                      </span>
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 w-10 sm:w-12 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {canReview && !showForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        )}

        {showForm && canReview && (
          <div className="mb-6">
            <ReviewForm
              productId={productId}
              orderId={effectiveOrderId}
              onSubmit={handleCreateReview}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {editingReview && (
          <div className="mb-6">
            <ReviewForm
              productId={productId}
              onSubmit={handleUpdateReview}
              onCancel={() => setEditingReview(null)}
              initialData={{
                rating: editingReview.rating,
                comment: editingReview.comment || "",
                images: editingReview.images,
              }}
              isEdit={true}
              editCount={editingReview.editCount}
            />
          </div>
        )}

        {replyingToReview && (
          <div className="mb-6 bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4 border border-sky-200 dark:border-sky-800">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
              Reply to Review
            </h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              maxLength={1000}
              className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white resize-none mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setReplyingToReview(null);
                  setReplyText("");
                }}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReply(replyingToReview)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
              >
                Post Reply
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="review-scroll-container overflow-y-auto h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px] pr-2">
                <div className="space-y-3 sm:space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="shrink-0">
                      <ReviewCard
                        review={review}
                        onEdit={() => setEditingReview(review)}
                        onReply={(reviewId) => setReplyingToReview(reviewId)}
                        isStoreOwner={isStoreOwner}
                        productStoreId={productStoreId || undefined}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {reviews.length > 0 && productSlug && (
              <div className="mt-4">
                <Link
                  href={`/product/${productSlug}/reviews`}
                  className="w-full text-center text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium text-xs sm:text-sm md:text-base py-2.5 sm:py-3 transition-colors flex items-center justify-center gap-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg"
                >
                  <span>Review Detail</span>
                  <span className="text-gray-500 dark:text-gray-400">({reviews.length} reviews)</span>
                </Link>
              </div>
            )}
          </>
        )}
    </div>
  );
};

export default ReviewSection;

