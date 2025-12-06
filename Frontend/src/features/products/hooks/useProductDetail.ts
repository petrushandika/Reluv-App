"use client";

import { useState, useEffect } from "react";
import { Product } from "../types";
import { getProductBySlug } from "../api/productsApi";

export const useProductDetail = (slug: string | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      setError("Product slug is missing.");
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productData = await getProductBySlug(slug);
        if (!productData) {
          throw new Error("Product data is empty");
        }
        setProduct(productData);
      } catch (err: any) {
        const errorMessage = err?.message || "Product not found or failed to load.";
        setError(errorMessage);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, isLoading, error };
};
