"use client";

import React, { useState, useEffect } from "react";
import ProductGrid from "@/features/(main)/products/components/ProductGrid";
import CategoryHero from "@/shared/components/organisms/CategoryHero";
import { getCategoryBySlug } from "@/features/(main)/categories/api/categoryApi";
import { Category } from "@/features/(main)/categories/api/categoryApi";
import { getProducts } from "@/features/(main)/products/api/productsApi";
import { Product } from "@/features/(main)/products/types";

export default function Men() {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getCategoryBySlug("men");
        setCategory(categoryData);
      } catch (error) {
        setCategory({ id: 2, name: "Men", slug: "men" });
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
            title={category?.name || "Men"}
            description={`Explore the latest men's fashion collection. From casual wear to formal attire, find your perfect style with premium quality clothing.`}
            categorySlug="men"
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
