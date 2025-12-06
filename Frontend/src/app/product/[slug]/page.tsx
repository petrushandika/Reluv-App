"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share,
  MessageCircle,
  Smartphone,
  Plus,
  Minus,
} from "lucide-react";
import { PublicRoute } from "@/shared/components/guards/RouteGuards";
import ProductList from "@/features/products/components/ProductList";
import { useProductDetail } from "@/features/products/hooks/useProductDetail";
import { useProduct } from "@/features/products/hooks/useProduct";
import { useCart } from "@/features/cart/hooks/useCart";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { useBuyStore } from "@/features/checkout/store/buy.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import ShareModal from "@/shared/components/molecules/ShareModal";
import ProductDetailSkeleton from "@/shared/components/molecules/ProductDetailSkeleton";
import { formatPrice } from "@/shared/utils/format";
import { toast } from "sonner";

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const productSlug = params?.slug
    ? decodeURIComponent(params.slug as string)
    : null;

  const { product, isLoading, error } = useProductDetail(productSlug);
  const { recommendedProducts, isLoadingRecommended } = useProduct({
    limit: 10,
  });
  const { addItem: addItemToCart, isAdding } = useCart();
  const { addItem: addItemToWishlist, removeItem: removeItemFromWishlist } =
    useWishlist();
  const { setBuyItem } = useBuyStore();
  const { user, isAuthenticated } = useAuthStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const isWishlisted = useWishlistStore((state) =>
    product ? state.items.some((item) => item.productId === product.id) : false
  );

  const allImages =
    product?.images && Array.isArray(product.images) ? product.images : [];
  const maxImages = 9;
  const displayImages = allImages.slice(0, maxImages);

  useEffect(() => {
    if (product && product.images && product.images.length > 1) {
      product.images.slice(1, 4).forEach((url) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = url;
        document.head.appendChild(link);
      });
    }
  }, [product]);

  useEffect(() => {
    if (
      product &&
      displayImages.length > 0 &&
      selectedImageIndex >= displayImages.length
    ) {
      setSelectedImageIndex(0);
    }
  }, [displayImages.length, selectedImageIndex, product]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      if (selectedVariantIndex >= product.variants.length) {
        setSelectedVariantIndex(0);
      }
    }
  }, [product?.variants?.length, selectedVariantIndex, product]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || (!isLoading && !product)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The product you`re looking for doesn`t exist or could not be loaded.
          </p>
          {error && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Error: {error}
            </p>
          )}
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!product || !product.variants || product.variants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Product Not Available
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            This product is currently not available.
          </p>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];
  const installmentPrice = selectedVariant ? selectedVariant.price / 12 : 0;
  const isOwnProduct = Boolean(user && product && Number(user.id) === Number(product.sellerId));

  const nextImage = () => {
    setIsHovering(false);
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setIsHovering(false);
    setSelectedImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.closest("button")) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }

    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    if (isAuthenticated() && user && Number(user.id) === Number(product.sellerId)) {
      toast.error("Cannot Add to Cart", {
        description: "You cannot add your own product to the cart.",
      });
      return;
    }
    
    addItemToCart({ variantId: selectedVariant.id, quantity });
  };

  const handleBuyNow = async () => {
    if (!product || !selectedVariant) {
      return;
    }

    if (!isAuthenticated()) {
      toast.error("Sign In Required", {
        description: "You must sign in to purchase items.",
      });
      router.push("/auth/login");
      return;
    }

    if (user && Number(user.id) === Number(product.sellerId)) {
      toast.error("Cannot Buy Now", {
        description: "You cannot purchase your own product.",
      });
      return;
    }

    const buyItemData = {
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name || "Product",
      productImage: product.images[0] || "",
      variantPrice: selectedVariant.price || 0,
      variantSize: selectedVariant.size || undefined,
      variantColor: selectedVariant.color || undefined,
      quantity: quantity,
    };

    setBuyItem(buyItemData);

    router.prefetch("/checkout");
    router.push("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    
    if (isAuthenticated() && user && Number(user.id) === Number(product.sellerId)) {
      toast.error("Cannot Add to Wishlist", {
        description: "You cannot add your own product to the wishlist.",
      });
      return;
    }
    
    if (isWishlisted) {
      await removeItemFromWishlist({ productId: product.id });
    } else {
      await addItemToWishlist({ productId: product.id });
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
            <div className="space-y-4 lg:sticky top-8 self-start">
              <div className="relative bg-gray-50/90 dark:bg-gray-800/90 rounded-lg overflow-hidden">
                <div
                  ref={imageRef}
                  className="aspect-square relative overflow-hidden cursor-zoom-in"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="relative w-full h-full">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className="absolute inset-0 w-full h-full"
                        style={{
                          opacity: index === selectedImageIndex ? 1 : 0,
                          transform:
                            isHovering && index === selectedImageIndex
                              ? `scale(2) translate(${
                                  (50 - mousePosition.x) * 0.5
                                }%, ${(50 - mousePosition.y) * 0.5}%)`
                              : "scale(1)",
                          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                          transition:
                            index === selectedImageIndex
                              ? isHovering
                                ? "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out"
                                : "opacity 0.4s ease-in-out, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                              : "opacity 0.4s ease-in-out",
                          pointerEvents:
                            index === selectedImageIndex ? "auto" : "none",
                          willChange:
                            index === selectedImageIndex
                              ? "transform, opacity"
                              : "opacity",
                        }}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover select-none"
                          draggable={false}
                          priority={index === 0}
                          quality={95}
                          unoptimized={
                            image.startsWith("http://localhost") ||
                            image.includes("cloudinary")
                          }
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "https://placehold.co/800x800/e2e8f0/e2e8f0?text=No+Image";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={prevImage}
                    onMouseEnter={() => setIsHovering(false)}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 shadow-md transition-all duration-200 z-10 touch-manipulation items-center justify-center cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    onMouseEnter={() => setIsHovering(false)}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 shadow-md transition-all duration-200 z-10 touch-manipulation items-center justify-center cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-white" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
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
                    className={`relative aspect-square bg-gray-50/90 dark:bg-gray-800/90 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                      index === selectedImageIndex
                        ? "ring-2 ring-sky-600 dark:ring-sky-400"
                        : ""
                    }`}
                  >
                    <Image
                      src={thumb}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                      className="object-cover select-none transition-opacity duration-200"
                      quality={90}
                      loading={index < 4 ? "eager" : "lazy"}
                      unoptimized={
                        thumb.startsWith("http://localhost") ||
                        thumb.includes("cloudinary")
                      }
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://placehold.co/200x200/e2e8f0/e2e8f0?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-3 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/30 dark:border-gray-700/30 shadow-sm">
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
                    <button 
                      onClick={() => {
                        toast.info("Authenticity Guarantee", {
                          description: "All products are verified for authenticity. We ensure 100% genuine luxury products.",
                        });
                      }}
                      className="text-sky-600 dark:text-sky-400 font-medium hover:underline cursor-pointer"
                    >
                      Learn more
                    </button>
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2 glossy-text-title">
                  {product.store?.name || "Reluv"}
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-800 dark:text-white leading-tight glossy-text-strong">
                  {product.name}
                </h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline flex-wrap gap-2 sm:gap-3">
                  {selectedVariant.compareAtPrice ? (
                    <>
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white glossy-text-title">
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
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-sky-600 dark:bg-sky-500 rounded-sm flex items-center justify-center shrink-0">
                    <span className="text-[10px] sm:text-xs text-white font-bold">
                      ✓
                    </span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Installment</span> from
                    {formatPrice(installmentPrice)}/month
                  </span>
                  <button 
                    onClick={() => {
                      toast.info("Installment Details", {
                        description: `Pay ${formatPrice(installmentPrice)} per month for 12 months. Total: ${formatPrice(selectedVariant.price)}`,
                      });
                    }}
                    className="text-sky-600 dark:text-sky-400 font-medium hover:underline cursor-pointer"
                  >
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
                        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                          index === selectedVariantIndex
                            ? "ring-2 ring-sky-600 dark:ring-sky-400"
                            : ""
                        }`}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={
                              product.images[0] ||
                              "https://placehold.co/200x200/e2e8f0/e2e8f0?text=Image"
                            }
                            alt={variant.size || "Variant image"}
                            fill
                            sizes="(max-width: 640px) 48px, 64px"
                            className="object-cover rounded-lg select-none"
                            quality={85}
                            loading="lazy"
                            unoptimized={
                              product.images[0]?.startsWith(
                                "http://localhost"
                              ) || product.images[0]?.includes("cloudinary")
                            }
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Smartphone className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Try virtual try-on and see size on the app to see how the
                    product fits you.{" "}
                    <button 
                      onClick={() => {
                        toast.info("Virtual Try-On", {
                          description: "Download our mobile app to try on products virtually and see how they fit.",
                        });
                      }}
                      className="text-sky-600 dark:text-sky-400 font-medium hover:underline cursor-pointer"
                    >
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
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-sky-600 dark:text-sky-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-lg transition-colors touch-manipulation cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 sm:px-5 text-base sm:text-lg font-semibold text-gray-800 dark:text-white min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(selectedVariant.stock, q + 1))
                    }
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-sky-600 dark:text-sky-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-lg transition-colors touch-manipulation cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {isOwnProduct ? (
                <div className="pt-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                    You cannot add or purchase your own product.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || isOwnProduct}
                    className="w-full sm:w-auto flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-sky-600/50 dark:border-sky-400/50 text-sky-600 dark:text-sky-400 font-semibold py-3 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors hover:bg-sky-50/90 dark:hover:bg-sky-900/30 text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation shadow-md glossy-text-strong"
                  >
                    {isAdding ? "Adding..." : "Add To Cart"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isOwnProduct}
                    className="w-full sm:w-auto flex-1 bg-sky-600/90 dark:bg-sky-500/90 backdrop-blur-sm hover:bg-sky-700/90 dark:hover:bg-sky-600/90 text-white font-semibold py-3 sm:py-3 px-4 sm:px-6 rounded-lg transition-transform text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation shadow-md glossy-text-strong"
                  >
                    Buy Now
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-2 sm:gap-3 md:flex-row">
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  disabled={isOwnProduct}
                  className={`flex items-center justify-center w-full md:w-1/3 border font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 text-sm sm:text-base touch-manipulation ${
                    isOwnProduct
                      ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                      : isWishlisted
                      ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 cursor-pointer"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-all duration-200 ${
                      isOwnProduct
                        ? "text-gray-400 dark:text-gray-500"
                        : isWishlisted
                        ? "text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  />
                  <span
                    className={
                      isOwnProduct
                        ? "text-gray-400 dark:text-gray-500"
                        : isWishlisted
                        ? "text-red-500 dark:text-red-400"
                        : "text-inherit"
                    }
                  >
                    Wishlist
                  </span>
                </button>
                <div className="flex gap-2 sm:gap-3 w-full md:w-2/3">
                  <button 
                    onClick={() => {
                      toast.info("Customer Service", {
                        description: "Chat feature is coming soon. Please contact us via email for assistance.",
                      });
                    }}
                    className="flex items-center justify-center w-1/2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors duration-200 cursor-pointer text-sm sm:text-base touch-manipulation"
                  >
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
                  <button 
                    onClick={() => {
                      toast.info("Shipping Options", {
                        description: "Shipping options and costs will be calculated during checkout based on your delivery address.",
                      });
                    }}
                    className="mt-2 text-sky-600 dark:text-sky-400 font-medium cursor-pointer hover:underline"
                  >
                    See Shipping Options
                  </button>
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
                <button 
                  onClick={() => {
                    toast.info("Product Details", {
                      description: product.description || "No additional details available.",
                    });
                  }}
                  className="text-sky-600 dark:text-sky-400 font-medium text-xs sm:text-sm mt-2 hover:underline cursor-pointer"
                >
                  Read More
                </button>
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <img
                      src={
                        product.store?.profile?.avatar ||
                        "https://placehold.co/48x48/e2e8f0/e2e8f0?text=Store"
                      }
                      alt={product.store?.name || "Store"}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-md shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white truncate">
                        {product.store?.name || "Reluv"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (product?.store?.slug) {
                        router.push(`/store/${product.store.slug}`);
                      } else {
                        toast.error("Store not found", {
                          description: "Unable to navigate to store page.",
                        });
                      }
                    }}
                    className="mt-3 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-sky-600 dark:text-sky-400 border border-sky-600/50 dark:border-sky-400/50 font-semibold py-2.5 sm:py-2 px-4 rounded-lg hover:bg-gray-50/90 dark:hover:bg-gray-700/90 transition-colors text-xs sm:text-sm cursor-pointer touch-manipulation shadow-sm glossy-text-strong"
                  >
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
