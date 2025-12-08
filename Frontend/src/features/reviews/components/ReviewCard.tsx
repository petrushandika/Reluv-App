"use client";

import React, { useState } from "react";
import { Star, Edit2, MessageSquare, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Review } from "../types";
const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return options?.addSuffix ? "just now" : "now";
  } else if (minutes < 60) {
    return options?.addSuffix
      ? `${minutes} minute${minutes > 1 ? "s" : ""} ago`
      : `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (hours < 24) {
    return options?.addSuffix
      ? `${hours} hour${hours > 1 ? "s" : ""} ago`
      : `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (days < 7) {
    return options?.addSuffix
      ? `${days} day${days > 1 ? "s" : ""} ago`
      : `${days} day${days > 1 ? "s" : ""}`;
  } else if (weeks < 4) {
    return options?.addSuffix
      ? `${weeks} week${weeks > 1 ? "s" : ""} ago`
      : `${weeks} week${weeks > 1 ? "s" : ""}`;
  } else if (months < 12) {
    return options?.addSuffix
      ? `${months} month${months > 1 ? "s" : ""} ago`
      : `${months} month${months > 1 ? "s" : ""}`;
  } else {
    return options?.addSuffix
      ? `${years} year${years > 1 ? "s" : ""} ago`
      : `${years} year${years > 1 ? "s" : ""}`;
  }
};
import { useAuthStore } from "@/features/auth/store/auth.store";

interface ReviewCardProps {
  review: Review;
  onEdit?: () => void;
  onReply?: (reviewId: number) => void;
  isStoreOwner?: boolean;
  productStoreId?: number;
  fixedHeight?: boolean;
}

const ReviewCard = ({
  review,
  onEdit,
  onReply,
  isStoreOwner = false,
  productStoreId,
  fixedHeight = false,
}: ReviewCardProps) => {
  const { user } = useAuthStore();
  const [showFullComment, setShowFullComment] = useState(false);
  const [showFullReply, setShowFullReply] = useState(false);

  if (!review || !review.author) {
    return null;
  }

  const isAuthor = user?.id === review.author?.id;
  const canEdit = isAuthor && (review.editCount || 0) < 3;
  const canReply = isStoreOwner && productStoreId && !review.reply;

  const authorName =
    review.author?.firstName || review.author?.lastName
      ? `${review.author?.firstName || ""} ${review.author?.lastName || ""}`.trim()
      : "Anonymous";
      const authorAvatar = review.author?.profile?.avatar || "https://classroomclipart.com/image/static7/preview2/smartphone-user-3d-clay-icon-transparent-png-66678.jpg";

  const replyAuthorName = review.replyAuthor
    ? review.replyAuthor.firstName || review.replyAuthor.lastName
      ? `${review.replyAuthor.firstName || ""} ${review.replyAuthor.lastName || ""}`.trim()
      : "Seller"
    : null;
  const replyAuthorAvatar =
    review.replyAuthor?.profile?.avatar || "https://classroomclipart.com/image/static7/preview2/smartphone-user-3d-clay-icon-transparent-png-66678.jpg";

  const commentLength = review.comment?.length || 0;
  const shouldTruncateComment = commentLength > 200;
  const displayComment = shouldTruncateComment && !showFullComment
    ? review.comment?.substring(0, 200) + "..."
    : review.comment;

  const replyLength = review.reply?.length || 0;
  const shouldTruncateReply = replyLength > 200;
  const displayReply = shouldTruncateReply && !showFullReply
    ? review.reply?.substring(0, 200) + "..."
    : review.reply;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 space-y-4 ${fixedHeight ? 'h-full flex flex-col' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={authorAvatar}
              alt={authorName}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://classroomclipart.com/image/static7/preview2/smartphone-user-3d-clay-icon-transparent-png-66678.jpg";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {authorName}
              </h4>
              {(review.editCount || 0) > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                  (Edited)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (review.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                />
              ))}
            </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {review.createdAt
                  ? formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })
                  : "Recently"}
              </span>
            </div>
          </div>
        </div>
        {canEdit && onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg transition-colors"
            title="Edit review"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {review.comment && review.comment.trim() && (
        <div className={`text-gray-700 dark:text-gray-300 text-xs sm:text-sm md:text-base ${fixedHeight && !showFullComment ? 'flex-1 flex flex-col' : ''}`}>
          <p className={`${fixedHeight && !showFullComment ? 'line-clamp-3 overflow-hidden' : 'whitespace-pre-wrap'}`}>{displayComment}</p>
          {shouldTruncateComment && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 mt-1 text-xs sm:text-sm font-medium"
            >
              {showFullComment ? "Show less" : "Read More"}
            </button>
          )}
        </div>
      )}

      {review.images && Array.isArray(review.images) && review.images.length > 0 && (
        <div className="mt-3">
          <div className={`grid gap-2 ${
            review.images.length === 1 
              ? "grid-cols-1 max-w-xs" 
              : review.images.length === 2 
              ? "grid-cols-2 max-w-md" 
              : review.images.length === 3
              ? "grid-cols-2 max-w-md"
              : "grid-cols-2 sm:grid-cols-3 max-w-lg"
          }`}>
            {review.images.map((imageUrl, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 group cursor-pointer transition-all hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-md ${
                  review.images.length === 1
                    ? "aspect-video h-24 sm:h-28 md:h-32"
                    : review.images.length === 2
                    ? "aspect-square h-20 sm:h-24 md:h-28"
                    : review.images.length === 3 && index === 0
                    ? "col-span-2 aspect-video h-20 sm:h-24 md:h-28"
                    : "aspect-square h-20 sm:h-24 md:h-28"
                }`}
                onClick={() => window.open(imageUrl, "_blank")}
              >
                <Image
                  src={imageUrl}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/400x300/e2e8f0/e2e8f0?text=Image+Error";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}

      {review.reply && review.reply.trim() && (
        <div className="ml-4 sm:ml-8 pl-4 sm:pl-6 border-l-2 border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/20 rounded-r-lg p-3 sm:p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={replyAuthorAvatar}
                alt={replyAuthorName || "Store Owner"}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://classroomclipart.com/image/static7/preview2/smartphone-user-3d-clay-icon-transparent-png-66678.jpg";
                }}
          />
            </div>
            <div className="flex items-center gap-2">
              <h5 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                {replyAuthorName || "Store Owner"}
              </h5>
              <CheckCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Store Owner
              </span>
          </div>
        </div>
          <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm md:text-base">
            <p className="whitespace-pre-wrap">{displayReply}</p>
            {shouldTruncateReply && (
              <button
                onClick={() => setShowFullReply(!showFullReply)}
                className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 mt-1 text-xs sm:text-sm font-medium"
              >
                {showFullReply ? "Show less" : "Show more"}
              </button>
            )}
      </div>
        </div>
      )}

      {canReply && onReply && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onReply(review.id)}
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 text-sm font-medium transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reply to this review</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
