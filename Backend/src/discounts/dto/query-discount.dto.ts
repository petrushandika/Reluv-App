import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';

export enum DiscountScope {
  GLOBAL = 'GLOBAL',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
  STORE = 'STORE',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

export class QueryDiscountDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(DiscountScope)
  scope?: DiscountScope;

  @IsOptional()
  @IsEnum(DiscountType)
  type?: DiscountType;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  storeId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productId?: number;
}
