"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/features/products/types";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { toast } from "sonner";

const formatPrice = (price: number): string => {
  return `Rp${new Intl.NumberFormat("id-ID").format(price)}`;
};

const isNewProduct = (createdAt: string): boolean => {
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
  const { user } = useAuthStore();
  const isWishlisted = isInWishlist({ productId: product.id });
  const isOwnProduct = Boolean(user && product && Number(user.id) === Number(product.sellerId));

  const firstVariant =
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : null;

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://placehold.co/400x400/e2e8f0/e2e8f0?text=Image";

  const storeName = product.store?.name || "Reluv";
  const productName = product.name || "Unnamed Product";
  const productPrice = firstVariant?.price || 0;
  const compareAtPrice = firstVariant?.compareAtPrice || null;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !product) return;
    if (Number(user.id) === Number(product.sellerId)) {
      toast.error("Cannot Add to Wishlist", {
        description: "You cannot add your own product to the wishlist.",
      });
      return;
    }
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
        <Link href={`/product/${product.slug}`} prefetch={true}>
          <div className="bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-sm rounded overflow-hidden cursor-pointer aspect-square border border-gray-200/30 dark:border-gray-700/30 shadow-sm">
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover rounded group-hover/card:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {isNewProduct(product.createdAt) && (
          <span className="absolute top-3 left-3 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 text-[10px] px-2 py-1 rounded-sm z-10">
            New
          </span>
        )}

        <button
          onClick={handleWishlistToggle}
          disabled={isOwnProduct}
          className={`absolute top-3 right-3 z-10 p-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full border border-white/30 dark:border-gray-700/30 shadow-md transition-all duration-200 ${
            isOwnProduct
              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
              : isWishlisted
              ? "text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400 hover:bg-white dark:hover:bg-gray-700 cursor-pointer"
              : "text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-700 cursor-pointer"
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
      <Link href={`/product/${product.slug}`} prefetch={true}>
        <div className="pt-3 sm:pt-4 text-left cursor-pointer">
          <p className="font-bold text-xs sm:text-sm text-gray-800 dark:text-white glossy-text-strong">
            {storeName}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate mt-0.5 glossy-text">
            {productName}
          </p>
          {compareAtPrice ? (
            <div className="mt-1 flex items-baseline flex-wrap gap-x-1.5 sm:gap-x-2">
              <p className="font-bold text-red-600 text-sm sm:text-base glossy-text-strong">
                {formatPrice(productPrice)}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through glossy-text">
                {formatPrice(compareAtPrice)}
              </p>
            </div>
          ) : (
            <p className="font-bold text-gray-900 dark:text-white mt-1 text-sm sm:text-base glossy-text-strong">
              {productPrice > 0
                ? formatPrice(productPrice)
                : "Price unavailable"}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
