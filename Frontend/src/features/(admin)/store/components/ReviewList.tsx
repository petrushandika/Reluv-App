"use client";

import { formatDistanceToNow } from "date-fns";
import { Star, MessageSquare, Reply } from "lucide-react";
import { useState } from "react";

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

interface ReviewListProps {
  reviews: Review[];
  onReply: (review: Review, replyText: string) => void;
}

export default function ReviewList({ reviews, onReply }: ReviewListProps) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = (review: Review) => {
    if (!replyText.trim()) return;
    
    onReply(review, replyText);
    setReplyText("");
    setReplyingTo(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {review.reviewer.firstName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {review.reviewer.firstName} {review.reviewer.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.rating)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {review.rating}.0
                  </span>
                </div>
              </div>
            </div>

            {/* Product Name */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Product: <span className="font-medium text-gray-900 dark:text-white">{review.productName}</span>
            </p>

            {/* Review Comment */}
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {review.comment}
            </p>

            {/* Reply Section */}
            {review.reply ? (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-sky-500">
                <div className="flex items-start gap-2 mb-2">
                  <Reply className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Your Reply
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {review.reply.comment}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {formatDistanceToNow(new Date(review.reply.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ) : replyingTo === review.id ? (
              <div className="space-y-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  rows={3}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:text-white resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSubmitReply(review)}
                    disabled={!replyText.trim()}
                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setReplyingTo(review.id)}
                className="flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
              >
                <Reply className="w-4 h-4" />
                Reply to this review
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
