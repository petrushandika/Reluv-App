"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share,
  MessageCircle,
  Smartphone,
  Search,
} from "lucide-react";
import { recommended, slashedPrices, trendingNow } from "../data/men";
import ProductList from "./ProductList";

const formatPrice = (price: number) => {
  return `Rp${new Intl.NumberFormat("id-ID").format(price)}`;
};

const ProductDetail = () => {
  const params = useParams();
  const productId = parseInt(params?.id as string);

  // Find product from all arrays
  const allProducts = [...trendingNow, ...slashedPrices, ...recommended];
  const product = allProducts.find((p) => p.id === productId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            The product you`re looking for doesn`t exist.
          </p>
        </div>
      </div>
    );
  }

  const productImages = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
  ];

  const thumbnails = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
  ];

  const variants = [
    { name: "Nude", color: "#D4B896", available: true, stock: "Limited Stock" },
  ];

  // Get recommended products (exclude current product)
  const recommendedProducts = recommended
    .filter((p) => p.id !== productId)
    .slice(0, 10);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-20 xl:px-40 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-4 lg:sticky top-8 self-start">
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                <button className="absolute bottom-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200">
                  <Search className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === selectedImageIndex
                        ? "bg-sky-600"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === selectedImageIndex
                      ? "border-sky-600"
                      : "border-transparent hover:border-gray-300"
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

            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-800">✓</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">100% Authentic</h3>
                <p className="text-sm text-gray-600">
                  Dedicated to providing genuine luxury products that uphold the
                  highest standards of quality.{" "}
                  <span className="text-sky-600 font-medium cursor-pointer hover:underline">
                    Learn more
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-2">
                {product.brand}
              </h1>
              <h2 className="text-2xl lg:text-3xl font-light text-gray-800 leading-tight">
                {product.name.replace("...", "")} Beige Ghw
              </h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                {product.originalPrice ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <div className="w-4 h-4 bg-sky-600 rounded-sm flex items-center justify-center">
                  <span className="text-xs text-white font-bold">✓</span>
                </div>
                <span className="text-gray-700">
                  <span className="font-medium">Installment</span> from
                  Rp2.473.333/month
                </span>
                <button className="text-sky-600 font-medium hover:underline">
                  See Detail
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Options Available
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Variant:</span>
                  <span className="text-gray-600">Nude -</span>
                  <span className="text-red-600 font-medium">
                    Limited Stock
                  </span>
                </div>

                <div className="flex space-x-3">
                  {variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                        index === selectedVariant
                          ? "border-sky-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={product.imageUrl}
                        alt={variant.name}
                        className="w-full h-full object-cover"
                      />
                      {index === selectedVariant && (
                        <div className="absolute inset-0 border-2 border-sky-600 rounded-lg"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Smartphone className="w-5 h-5 text-sky-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Try virtual try-on and see size on the app to see how the
                  product fits you.{" "}
                  <button className="text-sky-600 font-medium hover:underline">
                    Learn more
                  </button>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button className="w-full sm:w-auto flex-1 bg-white border-2 border-sky-600 text-sky-600 font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-sky-50 text-base">
                Add To Cart
              </button>
              <button className="w-full sm:w-auto flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-transform hover:scale-105 text-base">
                Buy Now
              </button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <button className="flex items-center justify-center w-full md:w-1/3 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                <Heart className="w-5 h-5 mr-2" />
                <span>Wishlist</span>
              </button>

              <div className="flex gap-3 w-full md:w-2/3">
                <button className="flex items-center justify-center w-1/2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span>Chat CS</span>
                </button>

                <button className="flex items-center justify-center w-1/2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
                  <Share className="w-5 h-5 mr-2" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Delivery & Returns
              </h3>
              <div className="text-sm text-gray-600">
                <p>
                  Shipping options may vary during checkout, depending on the
                  product and delivery address
                </p>
                <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                  🚚 Instant delivery available in selected cities
                </div>
                <p className="mt-2 text-sky-600 font-medium cursor-pointer hover:underline">
                  See Shipping Options
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                About The Product
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Category:</strong>{" "}
                  <span className="text-sky-700 font-medium cursor-pointer hover:underline">
                    Bags
                  </span>
                </p>
                <p>
                  <strong>Type:</strong>{" "}
                  <span className="text-sky-700 font-medium cursor-pointer hover:underline">
                    Tote Bags
                  </span>
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Highlights</h4>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Chain leather strap</li>
                  <li>Magnetic snap closure</li>
                  <li>Gold tone hardware</li>
                  <li>Exterior pocket</li>
                  <li>Zip pocket</li>
                  <li>Complete with Receipt</li>
                  <li>
                    Condition: Very Good. Item shows some visible defects on
                    certain parts or hardware. Item is still in a very good
                    shape and shows no change but some minor discoloration might
                    be found.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mt-4 mb-2">
                  Dimensions
                </h4>
                <p className="text-sm text-gray-700">L 34 x W 13 x H 25 cm</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mt-4 mb-2">
                  Materials
                </h4>
                <p className="text-sm text-gray-700">Caviar leather</p>
              </div>

              <button className="text-sky-600 font-medium text-sm mt-2 hover:underline">
                Read More
              </button>

              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://imgs.search.brave.com/ivG1zIrBWmERK1pk3vCbs6puU5uoDHK4cedt50ZMJqo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb21w/YW55bG9nb3Mub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzA3L05pa2UtMTk3/MS0zMDB4MTY5LnBu/Zw"
                    alt="Nike"
                    className="w-12 h-12 object-contain"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Nike</p>
                    <p className="text-sm text-gray-500">
                      223 products available
                    </p>
                  </div>
                </div>
                <button className="mt-3 w-full bg-white  text-sky-600 border border-sky-600 font-semibold py-2 px-4 rounded-lg hover:bg-white transition-colors text-sm">
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
        showSeeMoreButton={false}
      />
    </div>
  );
};

export default ProductDetail;
