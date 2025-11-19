"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  BadgePercent,
  Sparkles,
  ShoppingBag,
  Footprints,
  Shirt,
  Gem,
  Watch,
  Recycle,
  LayoutGrid,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Limited Offers",
    icon: BadgePercent,
    gradient: "from-rose-50 to-rose-100",
    iconColor: "text-rose-600",
    borderColor: "border-rose-200",
  },
  {
    id: 2,
    name: "New Arrival",
    icon: Sparkles,
    gradient: "from-amber-50 to-amber-100",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
  },
  {
    id: 3,
    name: "Bags",
    icon: ShoppingBag,
    gradient: "from-indigo-50 to-indigo-100",
    iconColor: "text-indigo-600",
    borderColor: "border-indigo-200",
  },
  {
    id: 4,
    name: "Shoes",
    icon: Footprints,
    gradient: "from-slate-50 to-slate-100",
    iconColor: "text-slate-600",
    borderColor: "border-slate-200",
  },
  {
    id: 5,
    name: "Clothing",
    icon: Shirt,
    gradient: "from-pink-50 to-pink-100",
    iconColor: "text-pink-600",
    borderColor: "border-pink-200",
  },
  {
    id: 6,
    name: "Accessories",
    icon: Gem,
    gradient: "from-purple-50 to-purple-100",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  {
    id: 7,
    name: "Watches",
    icon: Watch,
    gradient: "from-teal-50 to-teal-100",
    iconColor: "text-teal-600",
    borderColor: "border-teal-200",
  },
  {
    id: 8,
    name: "Preloved",
    icon: Recycle,
    gradient: "from-emerald-50 to-emerald-100",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200",
  },
  {
    id: 9,
    name: "Others",
    icon: LayoutGrid,
    gradient: "from-sky-50 to-sky-100",
    iconColor: "text-sky-600",
    borderColor: "border-sky-200",
  },
];

interface CategoryCardProps {
  category: (typeof categories)[0];
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const IconComponent = category.icon;

  return (
    <div className="flex-none">
      <div className="group cursor-pointer">
        <div
          className={`
          aspect-square w-28 sm:w-32 md:w-36 lg:w-40
          bg-gradient-to-br ${category.gradient}
          border-2 ${category.borderColor}
          rounded-2xl
          flex flex-col items-center justify-center
          transition-all duration-300
          hover:scale-105 hover:shadow-lg hover:shadow-gray-200
          group-hover:border-opacity-60
          relative overflow-hidden
        `}
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent"></div>
          </div>

          <div
            className={`
            relative z-10 mb-1.5 sm:mb-2 md:mb-3
            p-1.5 sm:p-2 md:p-3
            ${category.iconColor}
            transition-transform duration-300
            group-hover:scale-110
          `}
          >
            <IconComponent
              size={20}
              className="sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
              strokeWidth={1.5}
            />
          </div>

          <div className="relative z-10 px-1.5 sm:px-2 text-center">
            <h3 className="text-sky-700 dark:text-sky-400 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base leading-tight">
              {category.name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

const Categories: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="w-full bg-white dark:bg-gray-900 py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40">
        <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-sky-600 dark:text-sky-400 mb-1">
              What would you like to find?
            </h2>
            <div className="w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"></div>
          </div>

          <button className="group flex items-center gap-1.5 sm:gap-2 text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition-all duration-300 font-medium text-xs sm:text-sm md:text-base touch-manipulation">
            <Grid3X3
              size={16}
              className="sm:w-[18px] sm:h-[18px] group-hover:rotate-90 transition-transform duration-300"
            />
            <span className="hidden sm:inline">See all</span>
            <span className="sm:hidden">All</span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 
                     text-sky-600 dark:text-sky-400 p-2.5 rounded-full transition-all duration-200
                     items-center justify-center hover:scale-105 group"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5 text-sky-600 group-hover:text-sky-600 transition-colors" />
          </button>

          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 
                     text-sky-600 dark:text-sky-400 p-2.5 rounded-full transition-all duration-200
                     items-center justify-center hover:scale-105 group"
            aria-label="Next categories"
          >
            <ChevronRight className="w-5 h-5 text-sky-600 group-hover:text-sky-600 transition-colors" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 sm:gap-4 md:gap-6 py-2 -mx-1 px-1">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
