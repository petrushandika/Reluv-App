"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const promoMessages = [
  "❄️ Holiday Season's Here, Shop Your Winterwear Now!",
  "🚨⚡️ Is Your Wishlist 70% OFF? - Find Out!",
  "🎁 Special Offer: Free Shipping on Orders Over Rp 500.000",
  "✨ New Arrivals: Discover the Latest Fashion Trends",
  "💎 Premium Collection: Luxury Items at Best Prices",
  "🔥 Flash Sale: Limited Time Only - Shop Now!",
  "🎉 Welcome Bonus: Get 10% Off Your First Order",
  "🌟 Member Exclusive: Enjoy Extra Discounts Today",
  "🛍️ Buy 2 Get 1 Free on Selected Items",
  "📦 Express Delivery Available in Selected Cities",
  "🎊 End of Year Sale: Up to 50% OFF on All Categories",
  "💳 Pay in 12 Installments - No Interest!",
  "🏆 VIP Members: Exclusive Access to Limited Editions",
  "🎯 Trending Now: Shop the Most Wanted Items",
  "⭐ Customer Favorite: Top Rated Products",
  "🎨 Designer Collection: Curated Just for You",
  "💝 Gift Cards Available: Perfect for Any Occasion",
  "🚀 Fast & Secure Checkout: Shop with Confidence",
  "🎪 Weekend Special: Extra 15% Off Everything",
  "🌙 Night Sale: Midnight Deals You Can't Miss",
];

const PromoMarquee = () => {
  const [opacity, setOpacity] = useState(1);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = 100;

      if (currentScrollY > maxScroll) {
        setOpacity(0);
      } else {
        const newOpacity = 1 - currentScrollY / maxScroll;
        setOpacity(Math.max(0, newOpacity));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => {
    setIsClosed(true);
    setOpacity(0);
  };

  if (isClosed || opacity === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full bg-gradient-to-r from-sky-600/95 via-sky-500/95 to-sky-600/95 dark:from-sky-700/95 dark:via-sky-600/95 dark:to-sky-700/95 backdrop-blur-md text-white py-2 overflow-hidden border-b border-sky-400/40 dark:border-sky-500/40 shadow-md"
      style={{
        opacity,
        transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-bg pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 flex items-center justify-between relative z-10">
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((repeat) => (
              <span key={repeat} className="inline-flex items-center">
                {promoMessages.map((msg, index) => (
                  <span
                    key={`${repeat}-${index}`}
                    className="inline-block mr-20 md:mr-40 text-xs sm:text-sm font-semibold tracking-[0.15em] whitespace-nowrap animate-smooth-blink"
                    style={{
                      letterSpacing: "0.2em",
                    }}
                  >
                    {msg.trim()}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 p-1.5 hover:bg-white/25 rounded-full transition-all duration-200 flex-shrink-0 group backdrop-blur-sm"
          aria-label="Close promo banner"
        >
          <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200 drop-shadow-sm" />
        </button>
      </div>
    </div>
  );
};

export default PromoMarquee;
