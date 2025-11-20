"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { WishlistItem } from "@/features/wishlist/types";
import WishlistSkeleton from '@/shared/components/molecules/WishlistSkeleton';

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
    e.preventDefault();
    e.stopPropagation();
    setRemovingId(productId);
    try {
      await removeItem(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <WishlistSkeleton />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white">
        <div className="container mx-auto px-6 md:px-10 xl:px-20 2xl:px-40 py-16">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center border border-gray-200">
            <Heart className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-black mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 mb-6">
              Save your favorite items here to shop for them later.
            </p>
            <Link
              href="/"
              className="bg-sky-600 text-white px-6 py-3 rounded-md hover:bg-sky-700 transition-colors w-full sm:w-auto inline-block text-center cursor-pointer font-medium"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-10 xl:px-20 2xl:px-40 py-12 md:py-12">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-black">
            My Wishlist
          </h1>
          <span className="text-sm font-medium bg-sky-100 text-sky-700 px-3 py-1 rounded-full">
            {wishlistItems.length} Items
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                  className="bg-white rounded-lg overflow-hidden"
                >
                  <div className="relative group/card">
                    <Link href={`/product/${product.id}`}>
                      <div className="bg-gray-50 overflow-hidden cursor-pointer aspect-square">
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
                      className="absolute top-3 right-3 z-20 p-1.5 bg-white/60 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-all duration-200 disabled:opacity-50 cursor-pointer"
                      aria-label="Hapus dari wishlist"
                    >
                      {removingId === product.id ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <div className="text-left cursor-pointer">
                        <p className="font-bold text-sm text-gray-800 mb-1">
                          {product.store?.name || "Reluv"}
                        </p>
                        <p className="text-sm text-gray-600 truncate mb-2">
                          {product.name}
                        </p>
                        {firstVariant?.compareAtPrice ? (
                          <div className="mt-1 flex items-baseline flex-wrap gap-x-2">
                            <p className="font-bold text-red-600 text-base">
                              {formatPrice(firstVariant.price)}
                            </p>
                            <p className="text-sm text-gray-400 line-through">
                              {formatPrice(firstVariant.compareAtPrice)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-bold text-gray-900 text-base">
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
