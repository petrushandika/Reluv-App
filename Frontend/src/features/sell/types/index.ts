export type Condition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";

export interface CreateVariantPayload {
  name?: string;
  price: number;
  stock: number;
  condition: Condition;
  conditionNote?: string;
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  description: string;
  images: string[];
  categoryId: number;
  isPreloved: boolean;
  variants: CreateVariantPayload[];
}

export interface ListingData {
  categoryId: number | null;
  name: string;
  description: string;
  price: string;
  condition: Condition | "";
  stock: number;
  weight: string;
  length: string;
  width: string;
  height: string;
  variantName: string;
  conditionNote: string;
  isPreloved: boolean;
}
