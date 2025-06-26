"use client";

import ProductList from "@/features/products/components/ProductList";
import ReviewList from "@/features/reviews/components/ReviewList";
import Banner from "@/shared/components/organisms/Banner";
import Categories from "@/shared/components/organisms/Categories";
import Promotion from "@/shared/components/organisms/Promotion";
import { trendingNow } from "@/features/products/data/trendingNow";
import { slashedPrices } from "@/features/products/data/slashedPrices";
import { recommended } from "@/features/products/data/recommended";

export default function WomenPage() {
  return (
    <div>
      <Banner />
      <Categories />
      <ProductList title="Trending Now" products={trendingNow} />
      <ProductList title="Slashed Prices" products={slashedPrices} />
      <ProductList title="Recommended" products={recommended} />
      <ReviewList />
      <Promotion />
    </div>
  );
}
