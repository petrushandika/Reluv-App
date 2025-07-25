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
        className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-black mb-4">Confirm Removal</h2>
        <p className="text-gray-600 mb-8">
          Are you sure you want to remove &ldquo;{itemName}&rdquo; from your
          cart?
        </p>
        <div className="flex justify-end items-center space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-md text-sm font-medium text-black border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
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
    return <Spinner />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 md:px-20 xl:px-40 py-12 md:py-12">
          <h1 className="text-xl md:text-2xl font-bold text-black mb-6 md:mb-8">
            Shopping Cart
          </h1>
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center border border-gray-200">
            <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg md:text-xl font-semibold text-black mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Add some products to get started
            </p>
            <Link
              href="/"
              className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-sky-600 transition-colors w-full sm:w-auto inline-block text-center cursor-pointer"
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
    <div className="min-h-screen bg-white">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmRemove}
        itemName={itemToRemove?.variant.product.name || ""}
      />

      <div className="container mx-auto px-6 md:px-20 xl:px-40 py-12 md:py-12">
        <h1 className="text-xl md:text-2xl font-bold text-black mb-6 md:mb-8">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-sky-600 flex items-center gap-3">
                  <ShoppingBag size={22} /> Cart Items ({cart.items.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        <img
                          src={
                            item.variant.product.images[0] ||
                            "https://placehold.co/100x100/e2e8f0/e2e8f0?text=Image"
                          }
                          alt={item.variant.product.name}
                          className="w-full sm:w-20 md:w-24 h-48 sm:h-20 md:h-24 object-cover rounded-lg bg-gray-100"
                        />
                      </div>

                      <div className="flex-grow w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                          <div className="flex-grow">
                            <p className="text-xs md:text-sm font-medium text-sky-600">
                              {item.variant.product.store?.name || "Reluv"}
                            </p>
                            <h3 className="text-sm md:text-base font-semibold text-black mt-1 line-clamp-2">
                              {item.variant.product.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 mt-2 text-xs md:text-sm text-gray-500">
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
                            className="text-gray-400 hover:text-red-500 transition-colors self-start sm:self-auto"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            {item.variant.compareAtPrice && (
                              <span className="text-xs md:text-sm text-gray-400 line-through">
                                {formatPrice(item.variant.compareAtPrice)}
                              </span>
                            )}
                            <span className="text-base md:text-lg font-bold text-black">
                              {formatPrice(item.variant.price)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end">
                            <span className="text-sm text-gray-600 sm:hidden">
                              Quantity:
                            </span>
                            <div className="flex items-center space-x-2 md:space-x-3">
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
                                className="p-1 md:p-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                              >
                                <Minus className="w-3 h-3 md:w-4 md:h-4" />
                              </button>

                              <span className="text-base md:text-lg font-semibold min-w-[2rem] text-center text-black">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateItemQuantity(item.id, {
                                    quantity: item.quantity + 1,
                                  })
                                }
                                className="p-1 md:p-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                              >
                                <Plus className="w-3 h-3 md:w-4 md:h-4" />
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
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 lg:sticky lg:top-4 border border-gray-200">
              <h2 className="text-base md:text-lg font-semibold text-black mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 md:space-y-3 mb-4">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-black">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-black">
                    {formatPrice(SHIPPING_COST)}
                  </span>
                </div>

                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Tax (PPN 11%)</span>
                  <span className="font-medium text-black">
                    {formatPrice(tax)}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-green-600">You Save</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(totalSavings)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-3 md:pt-4 mb-4 md:mb-6">
                <div className="flex justify-between">
                  <span className="text-base md:text-lg font-semibold text-black">
                    Total
                  </span>
                  <span className="text-base md:text-lg font-bold text-black">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/main/checkout"
                  className="block w-full bg-sky-500 text-white text-center py-3 px-4 rounded-md font-medium hover:bg-sky-600 transition-colors text-sm md:text-base cursor-pointer"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="block w-full text-black text-center border border-gray-300 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm md:text-base cursor-pointer"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-4 md:mt-6 text-xs text-gray-500 space-y-1 md:space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-500 rounded-full flex-shrink-0"></div>
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
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
