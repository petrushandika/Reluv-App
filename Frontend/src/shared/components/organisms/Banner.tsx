"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Star,
  Percent,
  Tag,
  Clock,
} from "lucide-react";

const Banner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const slides = [
    {
      id: 1,
      title: "Pre-loved Fashion",
      subtitle: "For Everyone",
      description:
        "Discover high-quality fashion collections for Women, Men & Kids at affordable prices.",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
      cta: "Shop Now",
      badge: "🛍️ New Arrivals",
      discount: "Up to 80% OFF",
      category: "Fashion",
    },
    {
      id: 2,
      title: "Branded Items",
      subtitle: "Special Prices",
      description:
        "Get original branded items in excellent condition at unbeatable prices.",
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=400&fit=crop",
      cta: "View Brands",
      badge: "💎 Premium Quality",
      discount: "50-70% OFF",
      category: "Brands",
    },
    {
      id: 3,
      title: "Flash Sale",
      subtitle: "Today Only!",
      description:
        "Don't miss the chance to grab your favorite fashion pieces with fantastic discounts.",
      image:
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=400&fit=crop",
      cta: "Grab Deals",
      badge: "⚡ Flash Sale",
      discount: "Extra 30% OFF",
      category: "Promo",
    },
  ];

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="relative">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {slides.map((slide) => (
              <div key={slide.id} className="embla__slide flex-none w-full">
                <div className="container mx-auto px-6 md:px-20 xl:px-40 py-4">
                  <div className="relative">
                    {/* Tombol Chevron telah dipindahkan dari sini */}
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center py-8 lg:py-12 min-h-[380px]">
                      <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="inline-flex items-center space-x-2 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full text-sm font-medium">
                            <span>{slide.badge}</span>
                          </div>
                          <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-sm font-bold">
                            <Percent className="w-4 h-4" />
                            <span>{slide.discount}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            {slide.title}
                            <span className="block text-sky-600 mt-1">
                              {slide.subtitle}
                            </span>
                          </h1>
                        </div>

                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                          {slide.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <button className="inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                            <ShoppingBag className="mr-2 w-5 h-5" />
                            <span>{slide.cta}</span>
                          </button>

                          <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:bg-gray-50">
                            <Heart className="mr-2 w-5 h-5" />
                            <span>Wishlist</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-6 pt-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">4.8/5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Fast Shipping</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4 text-green-500" />
                            <span>Quality Guarantee</span>
                          </div>
                        </div>
                      </div>

                      <div className="order-1 lg:order-2 relative">
                        <div className="relative">
                          <div className="relative overflow-hidden rounded-2xl shadow-xl">
                            <img
                              src={slide.image}
                              alt={slide.title}
                              className="w-full h-64 lg:h-80 object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                              <span className="text-sm font-medium text-gray-800">
                                {slide.category}
                              </span>
                            </div>

                            <div className="absolute top-4 right-4 bg-red-500 text-white rounded-lg px-3 py-1.5">
                              <span className="text-sm font-bold">
                                {slide.discount}
                              </span>
                            </div>
                          </div>

                          <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="w-5 h-5 text-sky-600" />
                              <div>
                                <div className="text-xs text-gray-500">
                                  Sold Today
                                </div>
                                <div className="text-sm font-bold text-gray-900">
                                  150+ Items
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Chevron dipindahkan ke sini agar statis */}
        <div className="container mx-auto px-6 md:px-20 xl:px-40 absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full">
            <button
              onClick={scrollPrev}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20  
                    text-sky-600 p-2.5 rounded-full transition-all duration-200 
                    items-center justify-center hover:scale-105 group pointer-events-auto"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-sky-600 group-hover:text-sky-600 transition-colors" />
            </button>

            <button
              onClick={scrollNext}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20  
                    text-sky-600 p-2.5 rounded-full transition-all duration-200 
                    items-center justify-center hover:scale-105 group pointer-events-auto"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-sky-600 group-hover:text-sky-600 transition-colors" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "bg-sky-600 w-6"
                    : "bg-sky-200 hover:bg-sky-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
