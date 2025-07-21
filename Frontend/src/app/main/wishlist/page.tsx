"use client";

import React, { JSX, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";

import { recommended } from "@/features/products/data/kids";
import { Product } from "@/features/products/types";
import ProductCard from "@/features/products/components/ProductCard";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}): JSX.Element | null => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Confirm Removal
        </h2>
        <p className="text-gray-600 mb-8">
          Are you sure you want to remove &ldquo;{itemName}&rdquo; from your
          wishlist?
        </p>
        <div className="flex justify-end items-center space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const Wishlist = (): JSX.Element => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(recommended);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<Product | null>(null);

  const requestRemoveItem = (product: Product) => {
    setItemToRemove(product);
    setIsModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      setWishlistItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemToRemove.id)
      );
    }
    // Reset state modal
    setIsModalOpen(false);
    setItemToRemove(null);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white">
        <div className="container mx-auto px-6 md:px-20 xl:px-40 py-16">
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
    <div className="bg-white text-black min-h-screen">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmRemove}
        itemName={itemToRemove?.name || ""}
      />

      <div className="container mx-auto px-6 md:px-20 xl:px-40 py-12 md:py-12">
        <h1 className="text-xl md:text-2xl font-bold text-black mb-6 md:mb-8">
          My Wishlist
        </h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-3">
              <Heart size={22} /> Wishlist Items ({wishlistItems.length})
            </h2>
          </div>

          <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="relative group/wishlist-item">
                <ProductCard product={product} />

                <button
                  onClick={() => requestRemoveItem(product)}
                  aria-label="Remove from wishlist"
                  className="absolute top-2 right-2 z-20 p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 opacity-0 group-hover/wishlist-item:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
