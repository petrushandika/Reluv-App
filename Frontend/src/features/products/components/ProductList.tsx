"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "../types";
import ProductCard from "./ProductCard";

const PrevButton = (props: { onClick: () => void; enabled: boolean }) => (
  <button
    onClick={props.onClick}
    disabled={!props.enabled}
    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 text-sky-600 p-2.5 rounded-full transition-all duration-200 items-center justify-center hover:scale-105 group pointer-events-auto disabled:opacity-30"
    aria-label="Previous slide"
  >
    <ChevronLeft className="w-5 h-5 text-sky-600 group-hover:text-sky-600 transition-colors" />
  </button>
);

const NextButton = (props: { onClick: () => void; enabled: boolean }) => (
  <button
    onClick={props.onClick}
    disabled={!props.enabled}
    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 text-sky-600 p-2.5 rounded-full transition-all duration-200 items-center justify-center hover:scale-105 group pointer-events-auto disabled:opacity-30"
    aria-label="Next slide"
  >
    <ChevronRight className="w-5 h-5 text-sky-600 group-hover:text-sky-600 transition-colors" />
  </button>
);

interface ProductListProps {
  title: string;
  products: Product[];
}

const ProductList = ({ title, products }: ProductListProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, []);

  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    onScroll(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("reInit", onScroll);
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
    };
  }, [emblaApi, onSelect, onScroll]);

  return (
    <div className="w-full bg-white py-8 md:py-12 lg:py-5">
      <div className="container mx-auto px-6 md:px-20 lg:px-40">
        <div className="flex flex-col justify-between mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-sky-600 mb-1">
            {title}
          </h2>
          <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"></div>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
          <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        </div>

        <div className="mt-0 md:mt-8 block md:hidden">
          <div className="bg-gray-200 rounded-full h-1 w-full overflow-hidden">
            <div
              className="bg-gray-700 h-1 rounded-full"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>

        <div className="text-center mt-4 md:mt-10">
          <button className="bg-white text-sky-600 font-semibold py-3 px-8 border border-sky-600 rounded-md hover:bg-sky-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50">
            See More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
