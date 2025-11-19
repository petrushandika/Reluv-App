"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share,
  MessageCircle,
  Smartphone,
  Search,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
import { PublicRoute } from "@/shared/components/guards/RouteGuards";
import ProductList from "@/features/products/components/ProductList";
import { useProductDetail } from "@/features/products/hooks/useProductDetail";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useCart } from "@/features/cart/hooks/useCart";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import ShareModal from "@/shared/components/molecules/ShareModal";

const formatPrice = (price: number) => {
  return `Rp${new Intl.NumberFormat("id-ID").format(price)}`;
};

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id ? parseInt(params.id as string, 10) : null;

  const { product, isLoading, error } = useProductDetail(productId);
  const { recommendedProducts, isLoadingRecommended } = useProduct({
    limit: 10,
  });
  const { addItem: addItemToCart, isAdding } = useCart();
  const {
    addItem: addItemToWishlist,
    removeItem: removeItemFromWishlist,
    isInWishlist,
  } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-sky-500 dark:text-sky-400" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            The product you`re looking for doesn`t exist or could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const installmentPrice = selectedVariant.price / 12;

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItemToCart({ variantId: selectedVariant.id, quantity });
    }
  };

  const handleBuyNow = () => {
    router.push("/checkout");
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeItemFromWishlist(product.id);
    } else {
      addItemToWishlist({ productId: product.id });
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-20 xl:px-40 py-6 sm:py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
            <div className="space-y-4 lg:sticky top-8 self-start">
              <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 shadow-md transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 shadow-md transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-white" />
                  </button>
                  <button className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 shadow-md transition-all duration-200">
                    <Search className="w-5 h-5 text-gray-700 dark:text-white" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === selectedImageIndex
                          ? "bg-sky-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((thumb, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === selectedImageIndex
                        ? "border-sky-600 dark:border-sky-400"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-800 dark:text-yellow-200">
                      ✓
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    100% Authentic
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Dedicated to providing genuine luxury products that uphold
                    the highest standards of quality.{" "}
                    <span className="text-sky-600 dark:text-sky-400 font-medium cursor-pointer hover:underline">
                      Learn more
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
                  {product.store?.name || "Reluv"}
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-800 dark:text-white leading-tight">
                  {product.name}
                </h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline flex-wrap gap-2 sm:gap-3">
                  {selectedVariant.compareAtPrice ? (
                    <>
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(selectedVariant.price)}
                      </span>
                      <span className="text-base sm:text-lg text-gray-400 dark:text-gray-500 line-through">
                        {formatPrice(selectedVariant.compareAtPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(selectedVariant.price)}
                    </span>
                  )}
                </div>
                <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-sky-600 dark:bg-sky-500 rounded-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] sm:text-xs text-white font-bold">
                      ✓
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Installment</span> from
                    {formatPrice(installmentPrice)}/month
                  </span>
                  <button className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                    See Detail
                  </button>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                  Options Available
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center flex-wrap gap-2 text-sm sm:text-base">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Variant:
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedVariant.size || ""} {selectedVariant.color || ""}{" "}
                      -
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {selectedVariant.stock > 0
                        ? `${selectedVariant.stock} left`
                        : "Out of Stock"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.variants.map((variant, index) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantIndex(index)}
                        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                          index === selectedVariantIndex
                            ? "border-sky-600 dark:border-sky-400"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <img
                          src={product.images[0]}
                          alt={variant.size || ""}
                          className="w-full h-full object-cover"
                        />
                        {index === selectedVariantIndex && (
                          <div className="absolute inset-0 border-2 border-sky-600 dark:border-sky-400 rounded-lg"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Smartphone className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Try virtual try-on and see size on the app to see how the
                    product fits you.{" "}
                    <button className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                      Learn more
                    </button>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 pt-3 sm:pt-4">
                <div className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Quantity:
                </div>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-sky-600 dark:text-sky-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-lg transition-colors touch-manipulation"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 sm:px-5 text-base sm:text-lg font-semibold text-gray-800 dark:text-white min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(selectedVariant.stock, q + 1))
                    }
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-sky-600 dark:text-sky-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-lg transition-colors touch-manipulation"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full sm:w-auto flex-1 bg-white dark:bg-gray-800 border-2 border-sky-600 dark:border-sky-400 text-sky-600 dark:text-sky-400 font-semibold py-3 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors hover:bg-sky-50 dark:hover:bg-sky-900/20 text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                >
                  {isAdding ? "Adding..." : "Add To Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full sm:w-auto flex-1 bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-600 text-white font-semibold py-3 sm:py-3 px-4 sm:px-6 rounded-lg transition-transform text-sm sm:text-base cursor-pointer touch-manipulation"
                >
                  Buy Now
                </button>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 md:flex-row">
                <button
                  onClick={handleWishlistToggle}
                  className="flex items-center justify-center w-full md:w-1/3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-200 cursor-pointer text-sm sm:text-base touch-manipulation"
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${
                      isWishlisted ? "text-red-500 fill-current" : ""
                    }`}
                  />
                  <span>Wishlist</span>
                </button>
                <div className="flex gap-2 sm:gap-3 w-full md:w-2/3">
                  <button className="flex items-center justify-center w-1/2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-200 cursor-pointer text-sm sm:text-base touch-manipulation">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    <span className="truncate">Chat CS</span>
                  </button>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center justify-center w-1/2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-200 cursor-pointer text-sm sm:text-base touch-manipulation"
                  >
                    <Share className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                  Delivery & Returns
                </h3>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    Shipping options may vary during checkout, depending on the
                    product and delivery address
                  </p>
                  <div className="mt-2 inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
                    ⚡ Instant delivery available in selected cities
                  </div>
                  <p className="mt-2 text-sky-600 dark:text-sky-400 font-medium cursor-pointer hover:underline">
                    See Shipping Options
                  </p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 border-t pt-4 sm:pt-6 border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                  About The Product
                </h3>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <p>
                    <strong>Category:</strong>{" "}
                    <span className="text-sky-700 dark:text-sky-400 font-medium cursor-pointer hover:underline">
                      {product.category.name}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm sm:text-base text-gray-800 dark:text-white mb-2">
                    Highlights
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm sm:text-base text-gray-800 dark:text-white mt-3 sm:mt-4 mb-2">
                    Dimensions
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    L {selectedVariant.length} x W {selectedVariant.width} x H{" "}
                    {selectedVariant.height} cm
                  </p>
                </div>
                <button className="text-sky-600 dark:text-sky-400 font-medium text-xs sm:text-sm mt-2 hover:underline">
                  Read More
                </button>
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <img
                      src={
                        product.store?.profile?.avatar ||
                        "https://placehold.co/48x48/e2e8f0/e2e8f0?text=Store"
                      }
                      alt={product.store?.name || "Store"}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white truncate">
                        {product.store?.name || "Reluv"}
                      </p>
                    </div>
                  </div>
                  <button className="mt-3 w-full bg-white dark:bg-gray-800 text-sky-600 dark:text-sky-400 border border-sky-600 dark:border-sky-400 font-semibold py-2.5 sm:py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm cursor-pointer touch-manipulation">
                    See All Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ProductList
          title="You May Also Like"
          products={recommendedProducts}
          isLoading={isLoadingRecommended}
        />
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={product}
      />
    </PublicRoute>
  );
};

export default ProductDetail;
