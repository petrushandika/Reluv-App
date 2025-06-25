"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const reviewsData = [
  {
    id: 1,
    name: "Andri Rianto",
    location: "visits Mall of Indonesia Boutique",
    avatarUrl: "https://i.pravatar.cc/40?u=1",
    rating: 5,
    date: "Mar 2025",
    text: "Their service very good and thats why I came back to buy from Reluv again.",
  },
  {
    id: 2,
    name: "Yudist Ardhana",
    location: "visits SUN Plaza Boutique",
    avatarUrl: "https://i.pravatar.cc/40?u=2",
    rating: 5,
    date: "Feb 2025",
    text: "Thanks Reluv, sudah beberapa kali belanja di Reluv, koleksinya lengkap, harganya bagus, pelayanan customer care onlinenya juga ramah dan memuaskan.",
  },
  {
    id: 3,
    name: "Rick Khoendarto",
    location: "visits SUN Plaza Boutique",
    avatarUrl: "https://i.pravatar.cc/40?u=3",
    rating: 5,
    date: "Feb 2025",
    text: "First time making a purchase here and everything was great, from hospitality all the way to the packaging and delivery of the purchased item. Recommended.",
  },
  {
    id: 4,
    name: "Carolyn Marsing",
    location: "visits Mall of Indonesia Boutique",
    avatarUrl: "https://i.pravatar.cc/40?u=4",
    rating: 5,
    date: "Jan 2025",
    text: "Great selection of items, and I'm always very impressed by the customer service. Replies are very fast and seamless. Highly recommended!",
  },
  {
    id: 5,
    name: "Jane Doe",
    location: "online purchase",
    avatarUrl: "https://i.pravatar.cc/40?u=5",
    rating: 5,
    date: "Jan 2025",
    text: "A fantastic online shopping experience. The website is easy to navigate and my order arrived faster than I expected. Will definitely shop here again.",
  },
];

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="#4285F4"
      d="M21.35 11.1H12.18v2.8h4.99c-.3 1.8-1.7 3.2-3.6 3.2-2.1 0-3.9-1.7-3.9-3.9s1.8-3.9 3.9-3.9c1 .5 1.7 1.3 2 2.2h2.8c-.6-2.3-2.5-4-4.8-4-3.3 0-6 2.7-6 6s2.7 6 6 6c3.1 0 5.6-2.5 5.6-5.6 0-.4 0-.7-.1-1.1z"
    />
  </svg>
);

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

const Review = () => {
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
      <div className="container mx-auto px-6 md:px-20 lg:px-40">
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
              {reviewsData.map((review) => (
                <div
                  key={review.id}
                  className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 pl-4"
                >
                  <div className="h-full flex flex-col bg-gray-50 border border-gray-100 rounded-lg p-6">
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
                        <p className="text-xs text-gray-400 mt-1">
                          {review.date}
                        </p>
                      </div>
                      <GoogleIcon />
                    </div>
                    <p className="text-gray-600 text-sm flex-grow mb-4">
                      {review.text}
                    </p>
                    <div className="flex items-center mt-auto">
                      <img
                        src={review.avatarUrl}
                        alt={review.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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

export default Review;
