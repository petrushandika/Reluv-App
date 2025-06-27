"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReviewCard from "./ReviewCard";
import { reviews } from "../data/review";

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
    <div className="w-full bg-white py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-6 md:px-20 xl:px-40">
        <div className="mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-sky-600">
            What{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Everyone</span>
              <span className="absolute left-0 bottom-0 w-full h-2 bg-sky-200/70 -z-0 -mb-1"></span>
            </span>{" "}
            is Saying About{" "}
            <span className="text-sky-600 font-bold">reluv.id</span>
          </h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
          <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
          <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        </div>

        <div className="text-center mt-12">
          <button className="bg-white text-sky-600 font-semibold py-3 px-8 border border-sky-600 rounded-md hover:bg-sky-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50">
            More About reluv.id
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
