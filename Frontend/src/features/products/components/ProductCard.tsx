"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "../types";

const formatPrice = (price: number) => {
  return `Rp${new Intl.NumberFormat("id-ID").format(price)}`;
};

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex-grow-0 flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/5 pl-4">
      <div className="relative group/card">
        <Link href={`/main/product/${product.id}`}>
          <div className="bg-gray-50 rounded overflow-hidden cursor-pointer">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-cover rounded group-hover/card:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {product.isNew && (
          <span className="absolute top-3 left-3 bg-black text-white text-[10px] px-2 py-1 rounded-sm z-10">
            New
          </span>
        )}

        <button
          className="absolute top-3 right-3 z-10 p-1.5 bg-white/60 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-500 hover:bg-white transition-all duration-200"
          aria-label="Add to wishlist"
        >
          <Heart className="w-5 h-5" />
        </button>

        {product.isPrime && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white to-transparent">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4/5">
              <div className="flex items-center justify-center bg-gradient-to-r from-yellow-300 to-yellow-400 text-black text-sm font-semibold py-1.5 px-3 rounded-md shadow-md">
                <span className="text-base font-bold mr-2">+</span>
                <span>Prime Picks!</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Link href={`/main/product/${product.id}`}>
        <div className="pt-4 text-left cursor-pointer">
          <p className="font-bold text-sm text-gray-800">{product.brand}</p>
          <p className="text-sm text-gray-600 truncate">{product.name}</p>
          {product.originalPrice ? (
            <div className="mt-1 flex items-baseline flex-wrap gap-x-2">
              <p className="font-bold text-red-600 text-base">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            </div>
          ) : (
            <p className="font-bold text-gray-900 mt-1 text-base">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
