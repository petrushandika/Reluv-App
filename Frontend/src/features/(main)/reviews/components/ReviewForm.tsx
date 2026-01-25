"use client";

import React, { useState } from "react";
import { Star, X, Upload } from "lucide-react";
import { CreateReviewData } from "../types";
import { toast } from "sonner";
import { handleApiError } from "@/shared/utils/handleApiError";

interface ReviewFormProps {
  productId: number;
  orderId?: number;
  onSubmit: (data: CreateReviewData) => Promise<void>;
  onCancel?: () => void;
  initialData?: {
    rating: number;
    comment?: string;
    images?: string[];
  };
  isEdit?: boolean;
  editCount?: number;
}

const ReviewForm = ({
  productId,
  orderId,
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
  editCount = 0,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        comment: comment.trim(),
        images: images.length > 0 ? images : undefined,
        orderId,
      });
      setRating(0);
      setComment("");
      setImages([]);
      setHoveredRating(0);
      if (onCancel) {
        onCancel();
      }
    } catch (error: any) {
      handleApiError(error, "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageAdd = (url: string) => {
    if (images.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    if (url.trim()) {
      setImages([...images, url.trim()]);
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const remainingEdits = isEdit ? 3 - editCount : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 sm:w-7 sm:h-7 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {rating} {rating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white resize-none"
              required
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {comment.length}/1000 characters
              </span>
              {isEdit && remainingEdits > 0 && (
                <span className="text-xs text-sky-600 dark:text-sky-400">
                  {remainingEdits} {remainingEdits === 1 ? "edit" : "edits"} remaining
                </span>
              )}
              {isEdit && remainingEdits === 0 && (
                <span className="text-xs text-red-500">
                  No edits remaining
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Images (Optional, max 5)
            </label>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL here (e.g., https://example.com/image.jpg)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.currentTarget;
                      if (input.value.trim()) {
                        handleImageAdd(input.value.trim());
                        input.value = "";
                      }
                    }
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:text-white text-sm"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value.trim()) {
                      handleImageAdd(input.value.trim());
                      input.value = "";
                    }
                  }}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Upload className="w-4 h-4" />
                  <span>Add Image</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You can add up to 5 images by pasting image URLs. Make sure the URLs are publicly accessible.
              </p>
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-3">
                  {images.map((url, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={url}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-sky-500 dark:hover:border-sky-400 transition-colors"
                        onError={() => {
                          toast.error(`Invalid image URL: ${url.substring(0, 30)}...`);
                          handleImageRemove(index);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim() || (isEdit && remainingEdits === 0)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>{isEdit ? "Update Review" : "Submit Review"}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;

