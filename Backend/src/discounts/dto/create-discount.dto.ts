import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsOptional,
  IsDate,
  IsBoolean,
  Min,
  Max,
  Length,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsEnum(DiscountType)
  @IsNotEmpty()
  type: DiscountType;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  value: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  maxDiscount?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  minPurchase?: number;

  @IsEnum(DiscountScope)
  @IsNotEmpty()
  scope: DiscountScope;

  @IsInt()
  @IsOptional()
  @Min(1)
  usageLimit?: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ValidateIf((o) => o.scope === DiscountScope.CATEGORY)
  @IsInt()
  @IsNotEmpty()
  categoryId?: number;

  @ValidateIf((o) => o.scope === DiscountScope.PRODUCT)
  @IsInt()
  @IsNotEmpty()
  productId?: number;

  @ValidateIf((o) => o.scope === DiscountScope.STORE)
  @IsInt()
  @IsNotEmpty()
  storeId?: number;
}
