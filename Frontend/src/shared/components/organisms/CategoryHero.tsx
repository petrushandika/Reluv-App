"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, TrendingUp, Tag } from "lucide-react";

interface CategoryHeroProps {
  title: string;
  description?: string;
  imageUrl?: string;
  categorySlug?: string;
}

const CategoryHero = ({ title, description, imageUrl, categorySlug }: CategoryHeroProps) => {
  const defaultImages: Record<string, string> = {
    women: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80",
    men: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    kids: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1920&q=80",
    "limited-offers": "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920&q=80",
    "new-arrivals": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80",
    sale: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80",
  };

  const heroImage = imageUrl || defaultImages[categorySlug || ""] || defaultImages.women;
  const defaultDescription = description || `Discover the latest ${title.toLowerCase()} fashion trends and styles. Shop now for exclusive deals and new arrivals!`;

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg mb-8">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/80 via-sky-800/70 to-sky-900/80 dark:from-sky-950/90 dark:via-sky-900/80 dark:to-sky-950/90" />
      </div>
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-sky-300 dark:text-sky-200" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              {title}
            </h1>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-sky-300 dark:text-sky-200" />
          </div>
          
          <p className="text-sm sm:text-base md:text-lg text-sky-100 dark:text-sky-200 mb-6 max-w-2xl mx-auto leading-relaxed">
            {defaultDescription}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              <Tag className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Exclusive Deals</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Trending Now</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">New Arrivals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHero;

