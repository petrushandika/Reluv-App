"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
      <div className="container mx-auto px-6 md:px-5 xl:px-24">
        <div className="flex justify-end">
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-10 h-10 bg-sky-600 dark:bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 pointer-events-auto"
            aria-label="Back to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
