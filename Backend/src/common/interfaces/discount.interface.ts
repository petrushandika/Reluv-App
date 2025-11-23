export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

export enum DiscountScope {
  GLOBAL = 'GLOBAL',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
  STORE = 'STORE',
}

export interface BaseDiscount {
  name: string;
  description?: string;
  type: DiscountType;
  value: number;
  maxDiscount?: number;
  minPurchase?: number;
  scope: DiscountScope;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
}

export interface CategoryDiscount extends BaseDiscount {
  scope: DiscountScope.CATEGORY;
  categoryId: number;
}

export interface ProductDiscount extends BaseDiscount {
  scope: DiscountScope.PRODUCT;
  productId: number;
}

export interface StoreDiscount extends BaseDiscount {
  scope: DiscountScope.STORE;
  storeId: number;
}

export interface GlobalDiscount extends BaseDiscount {
  scope: DiscountScope.GLOBAL;
}

export type Discount = CategoryDiscount | ProductDiscount | StoreDiscount | GlobalDiscount;
