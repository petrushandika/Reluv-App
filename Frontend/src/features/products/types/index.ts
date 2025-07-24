export type Condition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";

export interface Variant {
  id: number;
  productId: number;
  size: string | null;
  color: string | null;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  condition: Condition;
  conditionNote: string | null;
  weight: number;
  length: number;
  width: number;
  height: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  images: string[];
  isPublished: boolean;
  isPreloved: boolean;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  sellerId: number;
  categoryId: number;
  storeId: number | null;
  variants: Variant[];
  category: Category;
  store: Store | null;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  categoryId?: number;
  sellerId?: number;
  search?: string;
}
