"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Star, MessageSquare, CheckCircle, SlidersHorizontal } from "lucide-react";
import ReviewList from "@/features/(admin)/store/components/ReviewList";
import { toast } from "sonner";

interface Review {
  id: number;
  rating: number;
  comment: string;
  productName: string;
  productSlug: string;
  reviewer: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  reply?: {
    comment: string;
    createdAt: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "replied" | "unreplied">("all");

  const fetchReviews = async () => {
    try {
      setRefreshing(true);
      // Mock data
      const mockReviews: Review[] = [
        {
          id: 1,
          rating: 5,
          comment: "Excellent product! Very satisfied with the quality and fast shipping.",
          productName: "Nike Air Max 2024",
          productSlug: "nike-air-max-2024",
          reviewer: {
            firstName: "John",
            lastName: "Doe",
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          rating: 4,
          comment: "Good quality, but the size runs a bit small. Overall happy with the purchase.",
          productName: "Adidas Ultraboost",
          productSlug: "adidas-ultraboost",
          reviewer: {
            firstName: "Jane",
            lastName: "Smith",
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          reply: {
            comment: "Thank you for your feedback! We'll update the size guide.",
            createdAt: new Date(Date.now() - 43200000).toISOString(),
          },
        },
        {
          id: 3,
          rating: 5,
          comment: "Perfect! Exactly as described. Will buy again!",
          productName: "Puma RS-X",
          productSlug: "puma-rs-x",
          reviewer: {
            firstName: "Bob",
            lastName: "Johnson",
          },
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];

      setReviews(mockReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReply = async (review: Review, replyText: string) => {
    try {
      setReviews(reviews.map((r) =>
        r.id === review.id
          ? {
              ...r,
              reply: {
                comment: replyText,
                createdAt: new Date().toISOString(),
              },
            }
          : r
      ));
      toast.success("Reply sent successfully");
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const filteredReviews = reviews.filter((review) => {
    if (filter === "replied") return review.reply;
    if (filter === "unreplied") return !review.reply;
    return true;
  });

  const stats = {
    total: reviews.length,
    replied: reviews.filter((r) => r.reply).length,
    unreplied: reviews.filter((r) => !r.reply).length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0",
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reviews
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage customer reviews and feedback
          </p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm font-medium w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
             <MessageSquare className="w-4 h-4 text-gray-400" />
             <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
             <Star className="w-4 h-4 text-yellow-500" />
             <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.averageRating}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
             <CheckCircle className="w-4 h-4 text-green-500" />
             <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Replied</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{stats.replied}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
             <MessageSquare className="w-4 h-4 text-red-500" />
             <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Unreplied</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">{stats.unreplied}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-full sm:w-fit">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all ${
            filter === "all"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unreplied")}
          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all ${
            filter === "unreplied"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          Unreplied
        </button>
        <button
          onClick={() => setFilter("replied")}
          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all ${
            filter === "replied"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          Replied
        </button>
      </div>

      {/* Reviews List */}
      <ReviewList reviews={filteredReviews} onReply={handleReply} />

      {/* Results Count */}
      <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredReviews.length} of {reviews.length} reviews
      </div>
    </div>
  );
}
