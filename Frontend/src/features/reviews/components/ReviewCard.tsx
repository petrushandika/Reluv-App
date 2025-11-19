"use client";

import React from "react";
import { Star } from "lucide-react";
import { Review } from "../types";

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
  >
    <path
      fill="#4285F4"
      d="M21.35 11.1H12.18v2.8h4.99c-.3 1.8-1.7 3.2-3.6 3.2-2.1 0-3.9-1.7-3.9-3.9s1.8-3.9 3.9-3.9c1 .5 1.7 1.3 2 2.2h2.8c-.6-2.3-2.5-4-4.8-4-3.3 0-6 2.7-6 6s2.7 6 6 6c3.1 0 5.6-2.5 5.6-5.6 0-.4 0-.7-.1-1.1z"
    />
  </svg>
);

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 pl-4">
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <div className="flex items-center">
              {[...Array(review.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{review.date}</p>
          </div>
          <GoogleIcon />
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow mb-4">{review.text}</p>
        <div className="flex items-center mt-auto">
          <img
            src={review.avatarUrl}
            alt={review.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold text-sm text-gray-800 dark:text-white">{review.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{review.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
