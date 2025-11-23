export enum PromotionType {
  FLASH_SALE = 'FLASH_SALE',
  BOGO = 'BOGO',
  BUNDLE = 'BUNDLE',
  SEASONAL = 'SEASONAL',
  CUSTOM = 'CUSTOM',
}

export interface BasePromotion {
  name: string;
  type: PromotionType;
  description?: string;
  discount?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Promotion extends BasePromotion {
  storeId: number;
  productIds?: number[];
}
