"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/features/products/types";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";

const formatPrice = (price: number) => {
  return `Rp${new Intl.NumberFormat("id-ID").format(price)}`;
};

const isNewProduct = (createdAt: string) => {
  const productDate = new Date(createdAt);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return productDate > sevenDaysAgo;
};

interface ProductCardProps {
  product: Product;
  containerClassName?: string;
}

const ProductCard = ({ product, containerClassName }: ProductCardProps) => {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist({ productId: product.id });

  const firstVariant =
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null;
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://placehold.co/400x400/e2e8f0/e2e8f0?text=Image";

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeItem({ productId: product.id });
    } else {
      addItem({ productId: product.id });
    }
  };

  const defaultClasses =
    "flex-grow-0 flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 pl-4";

  return (
    <div className={containerClassName || defaultClasses}>
      <div className="relative group/card">
        <Link href={`/product/${product.id}`} prefetch={true}>
          <div className="bg-gray-50 dark:bg-gray-800 rounded overflow-hidden cursor-pointer aspect-square">
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

        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full transition-all duration-200 ${
            isWishlisted
              ? "text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400 hover:bg-white dark:hover:bg-gray-700"
              : "text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-700"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted
                ? "text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400"
                : ""
            }`}
          />
        </button>
      </div>
      <Link href={`/product/${product.id}`} prefetch={true}>
        <div className="pt-3 sm:pt-4 text-left cursor-pointer">
          <p className="font-bold text-xs sm:text-sm text-gray-800 dark:text-white">
            {product.store?.name || "Reluv"}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate mt-0.5">
            {product.name}
          </p>
          {firstVariant?.compareAtPrice ? (
            <div className="mt-1 flex items-baseline flex-wrap gap-x-1.5 sm:gap-x-2">
              <p className="font-bold text-red-600 text-sm sm:text-base">
                {formatPrice(firstVariant.price)}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(firstVariant.compareAtPrice)}
              </p>
            </div>
          ) : (
            <p className="font-bold text-gray-900 dark:text-white mt-1 text-sm sm:text-base">
              {firstVariant
                ? formatPrice(firstVariant.price)
                : "Price unavailable"}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
