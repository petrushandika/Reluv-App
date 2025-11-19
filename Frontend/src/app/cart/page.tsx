"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/hooks/useCart";
import { CartItem } from "@/features/cart/types";
import Spinner from "@/shared/components/atoms/Spinner";

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
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-black dark:text-white mb-4">
          Confirm Removal
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Are you sure you want to remove &ldquo;{itemName}&rdquo; from your
          cart?
        </p>
        <div className="flex justify-end items-center space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-md text-sm font-medium text-black dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-md bg-red-600 dark:bg-red-500 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const formatPrice = (price: number) => {
  return `Rp${new Intl.NumberFormat("id-ID").format(price)}`;
};

const Cart = () => {
  const { cart, isFetchingCart, subtotal, updateItemQuantity, removeItem } =
    useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  const SHIPPING_COST = 25000;
  const TAX_RATE = 0.11;

  const requestRemoveItem = (item: CartItem) => {
    setItemToRemove(item);
    setIsModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove.id);
    }
    setIsModalOpen(false);
    setItemToRemove(null);
  };

  if (isFetchingCart) {
    return <CartSkeleton />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-12">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6 md:mb-8">
            Shopping Cart
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sm:p-8 md:p-12 text-center border border-gray-200 dark:border-gray-700">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-black dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
              Add some products to get started
            </p>
            <Link
              href="/"
              className="bg-sky-500 dark:bg-sky-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-sky-600 dark:hover:bg-sky-700 transition-colors w-full sm:w-auto inline-block text-center cursor-pointer text-sm sm:text-base touch-manipulation"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tax = subtotal * TAX_RATE;
  const total = subtotal + SHIPPING_COST + tax;
  const totalSavings = cart.items.reduce((sum, item) => {
    if (item.variant.compareAtPrice) {
      return (
        sum + (item.variant.compareAtPrice - item.variant.price) * item.quantity
      );
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmRemove}
        itemName={itemToRemove?.variant.product.name || ""}
      />

      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-12">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6 md:mb-8">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-2 sm:gap-3">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" /> Cart Items (
                  {cart.items.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4">
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <img
                          src={
                            item.variant.product.images[0] ||
                            "https://placehold.co/100x100/e2e8f0/e2e8f0?text=Image"
                          }
                          alt={item.variant.product.name}
                          className="w-full sm:w-20 md:w-24 h-40 sm:h-20 md:h-24 object-cover rounded-lg bg-gray-100 dark:bg-gray-700"
                        />
                      </div>

                      <div className="flex-grow w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                          <div className="flex-grow min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-sky-600 dark:text-sky-400">
                              {item.variant.product.store?.name || "Reluv"}
                            </p>
                            <h3 className="text-sm sm:text-base font-semibold text-black dark:text-white mt-1 line-clamp-2">
                              {item.variant.product.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {item.variant.size && (
                                <span>Size: {item.variant.size}</span>
                              )}
                              {item.variant.color && (
                                <span>Color: {item.variant.color}</span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => requestRemoveItem(item)}
                            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors self-start sm:self-auto"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 sm:mt-4 space-y-2 sm:space-y-0">
                          <div className="flex items-center flex-wrap gap-2">
                            {item.variant.compareAtPrice && (
                              <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
                                {formatPrice(item.variant.compareAtPrice)}
                              </span>
                            )}
                            <span className="text-sm sm:text-base md:text-lg font-bold text-black dark:text-white">
                              {formatPrice(item.variant.price)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end">
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 sm:hidden">
                              Quantity:
                            </span>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateItemQuantity(item.id, {
                                      quantity: item.quantity - 1,
                                    });
                                  } else {
                                    requestRemoveItem(item);
                                  }
                                }}
                                className="p-1.5 sm:p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 touch-manipulation"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 dark:text-gray-300" />
                              </button>

                              <span className="text-sm sm:text-base md:text-lg font-semibold min-w-[2rem] text-center text-black dark:text-white">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateItemQuantity(item.id, {
                                    quantity: item.quantity + 1,
                                  })
                                }
                                className="p-1.5 sm:p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 touch-manipulation"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 dark:text-gray-300" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-5 md:p-6 lg:sticky lg:top-4 border border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-3 sm:mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-3 sm:mb-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="font-medium text-black dark:text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping
                  </span>
                  <span className="font-medium text-black dark:text-white">
                    {formatPrice(SHIPPING_COST)}
                  </span>
                </div>

                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tax (PPN 11%)
                  </span>
                  <span className="font-medium text-black dark:text-white">
                    {formatPrice(tax)}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-green-600 dark:text-green-400">
                      You Save
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -{formatPrice(totalSavings)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-3.5 md:pt-4 mb-3 sm:mb-4 md:mb-6">
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-black dark:text-white">
                    Total
                  </span>
                  <span className="text-sm sm:text-base md:text-lg font-bold text-black dark:text-white">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Link
                  href="/checkout"
                  prefetch={true}
                  className="block w-full bg-sky-500 dark:bg-sky-600 text-white text-center py-3 sm:py-3 px-4 rounded-md font-medium hover:bg-sky-600 dark:hover:bg-sky-700 transition-colors text-sm sm:text-base cursor-pointer touch-manipulation"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="block w-full text-black dark:text-white text-center border border-gray-300 dark:border-gray-600 py-3 sm:py-3 px-4 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base cursor-pointer touch-manipulation"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-3 sm:mt-4 md:mt-6 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 space-y-1.5 sm:space-y-2">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sky-500 rounded-full flex-shrink-0"></div>
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span>Fast shipping available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
