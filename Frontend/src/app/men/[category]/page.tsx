"use client";

import React, { useState, useEffect } from "react";
import ProductGrid from "@/features/products/components/ProductGrid";
import CategoryHero from "@/shared/components/organisms/CategoryHero";
import { useParams } from "next/navigation";
import { getCategoryBySlug } from "@/features/categories/api/categoryApi";
import { Category } from "@/features/categories/api/categoryApi";
import { getProducts } from "@/features/products/api/productsApi";
import { Product } from "@/features/products/types";

export default function MenCategory() {
  const params = useParams();
  const categorySlug = params?.category as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categorySlug) return;
      try {
        const categoryData = await getCategoryBySlug(categorySlug);
        setCategory(categoryData);
      } catch (error) {
        const categoryTitle = categorySlug
          ? categorySlug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Category";
        setCategory({ id: 0, name: categoryTitle, slug: categorySlug });
      } finally {
        setIsLoadingCategory(false);
      }
    };
    fetchCategory();
  }, [categorySlug]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category?.id) return;
      setIsLoadingProducts(true);
      try {
        const categoryProducts = await getProducts({
          childCategoryId: category.id,
          parentCategoryId: category.parentId || undefined,
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
  }, [category?.id, category?.parentId]);

  const categoryTitle = category?.name || categorySlug
    ? categorySlug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Category";

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-10">
        {!isLoadingCategory && (
          <CategoryHero
            title={categoryTitle}
            description={`Explore our curated collection of ${categoryTitle.toLowerCase()}. Find the perfect pieces that match your style and preferences.`}
            categorySlug={categorySlug}
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

