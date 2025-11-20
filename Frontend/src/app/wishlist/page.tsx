"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { WishlistItem } from "@/features/wishlist/types";
import WishlistSkeleton from "@/shared/components/molecules/WishlistSkeleton";

const formatPrice = (price: number) => {
  return `Rp${new Intl.NumberFormat("id-ID").format(price)}`;
};

const isNewProduct = (createdAt: string) => {
  const productDate = new Date(createdAt);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return productDate > sevenDaysAgo;
};

const Wishlist = () => {
  const { wishlistItems, isLoading, removeItem } = useWishlist();
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemoveItem = async (e: React.MouseEvent, productId: number) => {
    console.log(
      "[Wishlist Page] handleRemoveItem called, productId:",
      productId
    );
    e.preventDefault();
    e.stopPropagation();
    if (removingId === productId) {
      console.log("[Wishlist Page] Already removing, skipping");
      return;
    }
    setRemovingId(productId);
    try {
      console.log("[Wishlist Page] Calling removeItem with:", { productId });
      await removeItem({ productId });
      console.log("[Wishlist Page] removeItem completed successfully");
    } catch (error) {
      console.error("[Wishlist Page] Failed to remove item:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <WishlistSkeleton />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-8 sm:py-12 md:py-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8 md:p-12 text-center border border-gray-200 dark:border-gray-700">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
              Save your favorite items here to shop for them later.
            </p>
            <Link
              href="/"
              className="bg-sky-600 dark:bg-sky-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors w-full sm:w-auto inline-block text-center cursor-pointer font-medium text-sm sm:text-base touch-manipulation"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-12">
        <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white">
            My Wishlist
          </h1>
          <span className="text-xs sm:text-sm font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 px-2.5 sm:px-3 py-1 rounded-full">
            {wishlistItems.length} Items
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {wishlistItems.map((item: WishlistItem) => {
              const { product } = item;
              const firstVariant =
                product.variants && product.variants.length > 0
                  ? product.variants[0]
                  : null;
              const imageUrl =
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "https://placehold.co/400x400/e2e8f0/e2e8f0?text=Image";

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
                >
                  <div className="relative group/card">
                    <Link href={`/product/${product.id}`}>
                      <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden cursor-pointer aspect-square">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover rounded group-hover/card:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {isNewProduct(product.createdAt) && (
                      <span className="absolute top-3 left-3 bg-black text-white text-[10px] px-2 py-1 rounded-sm z-10">
                        New
                      </span>
                    )}

                    {product.isPreloved && !isNewProduct(product.createdAt) && (
                      <span className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 rounded-sm z-10">
                        Preloved
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleRemoveItem(e, product.id)}
                      disabled={removingId === product.id}
                      className="absolute top-3 right-3 z-20 p-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full text-red-500 dark:text-red-400 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      {removingId === product.id ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="p-2.5 sm:p-3 md:p-4">
                    <Link href={`/product/${product.id}`}>
                      <div className="text-left cursor-pointer">
                        <p className="font-bold text-xs sm:text-sm text-gray-800 dark:text-white mb-0.5 sm:mb-1">
                          {product.store?.name || "Reluv"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate mb-1.5 sm:mb-2">
                          {product.name}
                        </p>
                        {firstVariant?.compareAtPrice ? (
                          <div className="mt-1 flex items-baseline flex-wrap gap-x-1.5 sm:gap-x-2">
                            <p className="font-bold text-red-600 dark:text-red-400 text-sm sm:text-base">
                              {formatPrice(firstVariant.price)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
                              {formatPrice(firstVariant.compareAtPrice)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                            {firstVariant
                              ? formatPrice(firstVariant.price)
                              : "Price unavailable"}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
