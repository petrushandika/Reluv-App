import Banner from "@/shared/components/organisms/Banner";
import Categories from "@/shared/components/organisms/Categories";
import ProductList from "@/features/products/components/ProductList";
import { trendingNow } from "@/features/products/data/trendingNow";
import { slashedPrices } from "@/features/products/data/slashedPrices";
import { recommended } from "@/features/products/data/recommended";
import ReviewList from "@/features/reviews/components/ReviewList";

export default function Home() {
  return (
    <div>
      <Banner />
      <Categories />
      <ProductList title="Trending Now" products={trendingNow} />
      <ProductList title="Slashed Prices" products={slashedPrices} />
      <ProductList title="Recommended" products={recommended} />
      <ReviewList />
    </div>
  );
}
