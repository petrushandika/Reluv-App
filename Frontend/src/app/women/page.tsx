"use client";

import React, { useState, useEffect } from "react";
import ProductGrid from "@/features/products/components/ProductGrid";
import CategoryHero from "@/shared/components/organisms/CategoryHero";
import { getCategoryBySlug } from "@/features/categories/api/categoryApi";
import { Category } from "@/features/categories/api/categoryApi";
import { getProducts } from "@/features/products/api/productsApi";
import { Product } from "@/features/products/types";

export default function Women() {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getCategoryBySlug("women");
        setCategory(categoryData);
      } catch (error) {
        setCategory({ id: 3, name: "Women", slug: "women" });
      } finally {
        setIsLoadingCategory(false);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category?.id) return;
      setIsLoadingProducts(true);
      try {
        const categoryProducts = await getProducts({
          categoryId: category.id,
          limit: 100,
        });
        setProducts(categoryProducts);
      } catch (error) {
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [category?.id]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-10">
        {!isLoadingCategory && (
          <CategoryHero
            title={category?.name || "Women"}
            description={`Discover the latest women's fashion trends, styles, and exclusive collections. Shop now for premium quality clothing and accessories.`}
            categorySlug="women"
          />
        )}
        
        <ProductGrid
          products={products}
          isLoading={isLoadingProducts}
          initialLimit={20}
          showSeeMore={true}
        />
      </div>
    </div>
  );
}
