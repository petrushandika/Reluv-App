"use client";

import React from "react";
import { Sparkles, TrendingUp, Tag, Percent, Gift, Zap } from "lucide-react";

interface CategoryHeroProps {
  title: string;
  description?: string;
  imageUrl?: string;
  categorySlug?: string;
}

const CategoryHero = ({ title, description, categorySlug }: CategoryHeroProps) => {
  const getAnimatedTexts = (slug?: string): string[] => {
    const slugLower = slug?.toLowerCase() || "";
    
    if (slugLower.includes('men')) {
      return ["DISKON", "SALES", "VOUCHERS", "PROMO", "SPECIAL", "DEALS"];
    } else if (slugLower.includes('women')) {
      return ["NEW ARRIVALS", "TRENDING", "HOT DEALS", "SALE", "EXCLUSIVE", "LIMITED"];
    } else if (slugLower.includes('kids')) {
      return ["FUN", "PLAYFUL", "CUTE", "TRENDY", "STYLISH", "COMFORT"];
    }
    
    return ["DISKON", "SALES", "VOUCHERS", "PROMO", "SPECIAL", "DEALS"];
  };

  const animatedTexts = getAnimatedTexts(categorySlug);
  const defaultDescription = description || `Discover the latest ${title.toLowerCase()} fashion trends and styles. Shop now for exclusive deals and new arrivals!`;

  return (
    <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden rounded-xl mb-6 sm:mb-8 shadow-lg bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 dark:from-sky-600 dark:via-sky-700 dark:to-sky-800">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/20 via-transparent to-sky-900/20" />
        
        {animatedTexts.map((text, index) => {
          const positions = [
            { start: 'top-left', animation: 'moveFromTopLeft' },
            { start: 'top-right', animation: 'moveFromTopRight' },
            { start: 'bottom-left', animation: 'moveFromBottomLeft' },
            { start: 'bottom-right', animation: 'moveFromBottomRight' },
            { start: 'top-center', animation: 'moveFromTopCenter' },
            { start: 'bottom-center', animation: 'moveFromBottomCenter' },
            { start: 'left-center', animation: 'moveFromLeftCenter' },
            { start: 'right-center', animation: 'moveFromRightCenter' },
            { start: 'center', animation: 'moveFromCenter' },
          ];
          
          const position = positions[index % positions.length];
          
          return (
            <div
              key={`${text}-${index}`}
              className={`absolute text-sky-200/25 dark:text-sky-100/15 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap select-none pointer-events-none ${position.start === 'top-left' ? 'top-0 left-0' : position.start === 'top-right' ? 'top-0 right-0' : position.start === 'bottom-left' ? 'bottom-0 left-0' : position.start === 'bottom-right' ? 'bottom-0 right-0' : position.start === 'top-center' ? 'top-0 left-1/2 -translate-x-1/2' : position.start === 'bottom-center' ? 'bottom-0 left-1/2 -translate-x-1/2' : position.start === 'left-center' ? 'left-0 top-1/2 -translate-y-1/2' : position.start === 'right-center' ? 'right-0 top-1/2 -translate-y-1/2' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}
              style={{
                animation: `${position.animation} ${18 + index * 2}s linear infinite`,
                animationDelay: `${index * 0.1}s`,
                willChange: 'transform, opacity',
              }}
            >
              {text}
            </div>
          );
        })}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-sky-400/20 dark:bg-sky-300/10 blur-3xl animate-pulse" />
          <div className="absolute w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-sky-300/20 dark:bg-sky-200/10 blur-2xl animate-ping" style={{ animationDuration: '3s' }} />
        </div>
      </div>
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
              {title}
            </h1>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <p className="text-xs sm:text-sm md:text-base text-sky-50 dark:text-sky-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {defaultDescription}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/30">
              <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Exclusive Deals</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/30">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Trending Now</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/30">
              <Percent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Big Discounts</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/30">
              <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Special Offers</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CategoryHero;

