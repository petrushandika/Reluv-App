"use client";

import ProductDetail from "@/features/products/components/ProductDetail";
import { PublicRoute } from "@/shared/components/guards/RouteGuards";

export default function ProductDetailPage() {
  return (
    <PublicRoute>
      <ProductDetail />
    </PublicRoute>
  );
}
