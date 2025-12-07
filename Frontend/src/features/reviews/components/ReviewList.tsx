"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

const PrevButton = (props: { onClick: () => void; enabled: boolean }) => (
  <button
    onClick={props.onClick}
    disabled={!props.enabled}
    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 text-sky-600 dark:text-sky-400 p-2.5 rounded-full transition-all duration-200 items-center justify-center hover:scale-105 group pointer-events-auto disabled:opacity-30"
    aria-label="Previous slide"
  >
    <ChevronLeft className="w-5 h-5 text-sky-600 group-hover:text-sky-600 transition-colors" />
  </button>
);

const NextButton = (props: { onClick: () => void; enabled: boolean }) => (
  <button
    onClick={props.onClick}
    disabled={!props.enabled}
    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 text-sky-600 dark:text-sky-400 p-2.5 rounded-full transition-all duration-200 items-center justify-center hover:scale-105 group pointer-events-auto disabled:opacity-30"
    aria-label="Next slide"
  >
    <ChevronRight className="w-5 h-5 text-sky-600 group-hover:text-sky-600 transition-colors" />
  </button>
);

const ReviewList = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

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

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full bg-white dark:bg-gray-900 py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-6 md:px-10 xl:px-20 2xl:px-40">
        <div className="mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-sky-600 dark:text-sky-400 glossy-text-title">
            What{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Everyone</span>
              <span className="absolute left-0 bottom-0 w-full h-2 bg-sky-200/70 dark:bg-sky-800/70 -z-0 -mb-1"></span>
            </span>{" "}
            is Saying About{" "}
            <span className="text-sky-600 dark:text-sky-400 font-bold">
              reluv
            </span>
          </h2>
        </div>

        <div className="relative">
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No reviews available yet.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-sky-600 dark:text-sky-400 font-semibold py-3 px-8 border border-sky-600/50 dark:border-sky-400/50 rounded-md hover:bg-sky-600/90 dark:hover:bg-sky-500/90 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:ring-opacity-50 shadow-md hover:shadow-lg cursor-pointer">
            More About reluv
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
