"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Star,
  Package,
  ShoppingBag,
  MapPin,
  Clock,
  CheckCircle2,
  Badge,
  Crown,
  Sparkles,
  Shield,
} from "lucide-react";
import { PublicRoute } from "@/shared/components/guards/RouteGuards";
import { getStoreBySlug, Store } from "@/features/store/api/storeApi";
import { getStoreReviews, StoreReview } from "@/features/store/api/reviewApi";
import { formatPrice } from "@/shared/utils/format";
import { toast } from "sonner";
import ProductCard from "@/features/products/components/ProductCard";
import { Product } from "@/features/products/types";

const StoreDetail = () => {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params?.slug
    ? decodeURIComponent(params.slug as string)
    : null;

  const [store, setStore] = useState<Store | null>(null);
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "reviews">("products");
  const [totalReviews, setTotalReviews] = useState(0);
  const [calculatedRating, setCalculatedRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      if (!storeSlug) return;

      setIsLoading(true);
      try {
        let storeData: Store;
        
        if (storeSlug.startsWith("seller-")) {
          const userId = parseInt(storeSlug.replace("seller-", ""));
          if (isNaN(userId)) {
            throw new Error("Invalid seller ID");
          }
          const { getSellerByUserId } = await import("@/features/store/api/storeApi");
          try {
            storeData = await getSellerByUserId(userId);
          } catch (sellerError: any) {
            const errorMsg = sellerError?.message || "Unable to load seller";
            if (errorMsg.includes("not found") || errorMsg.includes("no products")) {
              toast.error("Seller Not Found", {
                description: "This seller doesn't have any products yet.",
              });
              router.push("/");
              return;
            }
            throw sellerError;
          }
        } else {
          storeData = await getStoreBySlug(storeSlug);
        }
        
        setStore(storeData);
      } catch (error: any) {
        const errorMsg = error?.message || "Unable to load store";
        if (!errorMsg.includes("not found") && !errorMsg.includes("no products")) {
          toast.error("Store Not Found", {
            description: errorMsg || "The store you're looking for doesn't exist.",
          });
        }
        if (errorMsg.includes("not found") || errorMsg.includes("no products")) {
          router.push("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [storeSlug, router]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!store) return;

      try {
        const productIds = store.products.map((p) => p.id);
        const products = store.products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          images: p.images,
        }));
        const response = await getStoreReviews(productIds, products);
        setReviews(response.reviews);
        setTotalReviews(response.total);
        
        if (response.total > 0) {
          setCalculatedRating(response.averageRating);
        } else {
          setCalculatedRating(store.rating);
        }
      } catch (error) {
        setReviews([]);
        setCalculatedRating(store.rating);
      }
    };

    if (store) {
      fetchReviews();
    }
  }, [store]);

  useEffect(() => {
    if (activeTab === "reviews" && reviews.length === 0 && store) {
      const fetchReviewsForTab = async () => {
        try {
          const productIds = store.products.map((p) => p.id);
          const products = store.products.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            images: p.images,
          }));
          const response = await getStoreReviews(productIds, products);
          setReviews(response.reviews);
          setTotalReviews(response.total);
        } catch (error) {
          setReviews([]);
        }
      };
      fetchReviewsForTab();
    }
  }, [activeTab, store]);

  if (isLoading) {
    return (
      <PublicRoute>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </PublicRoute>
    );
  }

  if (!store) {
    return (
      <PublicRoute>
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Store Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The store you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors cursor-pointer"
            >
              Go to Home
            </button>
          </div>
        </div>
      </PublicRoute>
    );
  }

  const storeProducts: Product[] = store.products.map((p) => ({
    id: p.id,
    name: p.name || `Product #${p.id}`,
    slug: p.slug || `product-${p.id}`,
    description: p.description || "",
    images: Array.isArray(p.images) ? p.images : [],
    isPreloved: p.isPreloved || false,
    isPublished: true,
    isActive: true,
    createdAt: p.createdAt,
    updatedAt: p.createdAt,
    viewCount: p.viewCount || 0,
    categoryId: 0,
    storeId: store.id,
    category: { id: 0, name: "", slug: "" },
    store: {
      id: store.id,
      name: store.name,
      slug: store.slug,
      isActive: store.isActive,
      isVerified: store.isVerified,
      totalProducts: store.totalProducts,
      totalSales: store.totalSales,
      rating: store.rating,
      profile: store.profile,
    },
    variants: Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants.map((v) => ({
          id: v.id,
          productId: p.id,
          size: v.size,
          color: v.color,
          sku: null,
          price: v.price || 0,
          compareAtPrice: v.compareAtPrice || null,
          stock: v.stock || 0,
          condition: (v.condition as "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR") || "NEW",
          conditionNote: null,
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
          isActive: true,
          createdAt: p.createdAt,
          updatedAt: p.createdAt,
        }))
      : [],
    sellerId: store.user.id,
  }));

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-6 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
            <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
              <Image
                src={store.profile?.banner || "https://wikitravel.org/upload/shared//6/6a/Default_Banner.jpg"}
                alt={`${store.name} banner`}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="relative -mt-16 sm:-mt-20 md:-mt-24">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl shrink-0 bg-white dark:bg-gray-800">
                    {store.profile?.avatar ? (
                      <Image
                        src={store.profile.avatar}
                        alt={store.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                        <Package className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-sky-600 dark:text-sky-400" />
                      </div>
                    )}
                  </div>
                  {store.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-sky-600 dark:bg-sky-500 rounded-full p-1.5 border-2 border-white dark:border-gray-800 shadow-lg">
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 mt-4 sm:mt-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {store.name}
                    </h1>
                    {store.isVerified && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </div>
                    )}
                    {store.totalSales >= 100 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-semibold">
                        <Crown className="w-3.5 h-3.5" />
                        <span>Top Seller</span>
                      </div>
                    )}
                    {calculatedRating !== null && calculatedRating >= 4.5 && totalReviews >= 10 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Premium</span>
                      </div>
                    )}
                    {store.totalProducts >= 50 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                        <Badge className="w-3.5 h-3.5" />
                        <span>Established</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {calculatedRating !== null && calculatedRating > 0
                          ? calculatedRating.toFixed(1)
                          : store.rating && store.rating > 0
                          ? store.rating.toFixed(1)
                          : "0.0"}
                      </span>
                      {totalReviews > 0 && (
                        <span className="text-gray-500 dark:text-gray-500">
                          ({totalReviews})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Package className="w-4 h-4" />
                      <span>{store.totalProducts} Products</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <ShoppingBag className="w-4 h-4" />
                      <span>{store.totalSales} Sales</span>
                    </div>
                    {store.isVerified && (
                      <div className="flex items-center gap-1 text-sm text-sky-600 dark:text-sky-400">
                        <Shield className="w-4 h-4" />
                        <span>Verified Store</span>
                      </div>
                    )}
                  </div>

                  {store.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {[
                          store.location.city,
                          store.location.province,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {store.profile?.operational && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{store.profile.operational}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                      Store Owner: {store.user.firstName} {store.user.lastName}
                    </span>
                  </div>
                </div>
              </div>

              {store.profile?.bio && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {store.profile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                    activeTab === "products"
                      ? "border-sky-600 dark:border-sky-400 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Products ({store.totalProducts})</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                    activeTab === "reviews"
                      ? "border-sky-600 dark:border-sky-400 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Reviews ({totalReviews})</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "products" ? (
                <div>
                  {storeProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                      {storeProducts.map((product) => (
                        <div key={product.id} className="w-full">
                          <ProductCard product={product} containerClassName="w-full pl-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No products available yet.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6"
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0">
                              {review.user.profile?.avatar ? (
                                <Image
                                  src={review.user.profile.avatar}
                                  alt={`${review.user.firstName} ${review.user.lastName}`}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                                  <span className="text-sky-600 dark:text-sky-400 font-semibold text-sm">
                                    {review.user.firstName[0]}
                                    {review.user.lastName[0]}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                                    {review.user.firstName} {review.user.lastName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center">
                                      {renderStars(review.rating)}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {review.product && (
                                <Link
                                  href={`/product/${review.product.slug}`}
                                  className="inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 mb-2"
                                >
                                  <Package className="w-4 h-4" />
                                  <span className="truncate">{review.product.name}</span>
                                </Link>
                              )}

                              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                {review.comment}
                              </p>

                              {review.images && review.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                                  {review.images.map((img, idx) => (
                                    <div
                                      key={idx}
                                      className="relative aspect-square rounded-lg overflow-hidden"
                                    >
                                      <Image
                                        src={img}
                                        alt={`Review image ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No reviews yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default StoreDetail;

