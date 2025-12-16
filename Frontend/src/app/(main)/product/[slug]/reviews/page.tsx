"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Star, MessageSquare, Plus } from "lucide-react";
import { PublicRoute } from "@/shared/components/guards/RouteGuards";
import ReviewCard from "@/features/(main)/reviews/components/ReviewCard";
import ReviewForm from "@/features/(main)/reviews/components/ReviewForm";
import { getReviews, createReview, updateReview, replyReview } from "@/features/(main)/reviews/api/reviewApi";
import { Review, CreateReviewData, UpdateReviewData } from "@/features/(main)/reviews/types";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { useProductDetail } from "@/features/(main)/products/hooks/useProductDetail";
import { toast } from "sonner";

const ProductReviewsPage = () => {
  const params = useParams();
  const router = useRouter();
  const productSlug = params?.slug as string;
  const { product, isLoading: isLoadingProduct } = useProductDetail(productSlug);
  const { user, isAuthenticated } = useAuthStore();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [replyingToReview, setReplyingToReview] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [userStoreId, setUserStoreId] = useState<number | null>(null);

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

  const isStoreOwner = userStoreId !== null && product?.storeId === userStoreId;
  const userReview = reviews.find((r) => r.author.id === user?.id);
  const canReview = isAuthenticated() && !userReview && product?.id;

  useEffect(() => {
    if (product?.id) {
      fetchReviews();
    }
  }, [product?.id]);

  const fetchReviews = async () => {
    if (!product?.id) return;
    
    setIsLoading(true);
    try {
      const data = await getReviews(product.id);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReview = async (data: CreateReviewData) => {
    if (!product?.id) return;
    
    try {
      const newReview = await createReview(product.id, data);
      setReviews([newReview, ...reviews]);
      setShowForm(false);
      toast.success("Review submitted successfully!");
    } catch (error: any) {
      throw error;
    }
  };

  const handleUpdateReview = async (data: UpdateReviewData) => {
    if (!editingReview || !product?.id) return;

    try {
      const updatedReview = await updateReview(product.id, editingReview.id, data);
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
    if (!replyText.trim() || !product?.id) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const updatedReview = await replyReview(product.id, reviewId, {
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

  if (isLoadingProduct) {
    return (
      <PublicRoute>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-10">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </PublicRoute>
    );
  }

  if (!product) {
    return (
      <PublicRoute>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-10">
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Product not found</p>
            </div>
          </div>
        </div>
      </PublicRoute>
    );
  }

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-10">
          <Link
            href={`/product/${productSlug}`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Product</span>
          </Link>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reviews for {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {reviews.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 sm:p-6">
              <div className="flex-shrink-0">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                      {averageRating.toFixed(1)}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1 w-16 sm:w-20">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {rating}
                      </span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {canReview && !showForm && (
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
            </div>
          )}

          {showForm && canReview && product.id && (
            <div className="mb-6">
              <ReviewForm
                productId={product.id}
                orderId={undefined}
                onSubmit={handleCreateReview}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {editingReview && product.id && (
            <div className="mb-6">
              <ReviewForm
                productId={product.id}
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
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Reply to Review
              </h3>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white resize-none mb-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setReplyingToReview(null);
                    setReplyText("");
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReply(replyingToReview)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
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
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={() => setEditingReview(review)}
                  onReply={(reviewId) => setReplyingToReview(reviewId)}
                  isStoreOwner={isStoreOwner}
                  productStoreId={product.storeId || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicRoute>
  );
};

export default ProductReviewsPage;

