"use client";

import ProductList from "@/features/products/components/ProductList";
import ReviewList from "@/features/reviews/components/ReviewList";
import Banner from "@/shared/components/organisms/Banner";
import Categories from "@/shared/components/organisms/Categories";
import Promotion from "@/shared/components/organisms/Promotion";
import { trendingNow } from "@/features/products/data/kids";
import { slashedPrices } from "@/features/products/data/kids";
import { recommended } from "@/features/products/data/kids";

export default function Kids() {
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
