import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
  IsInt,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VoucherType } from '@prisma/client';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, { message: 'Voucher name must be between 1 and 255 characters' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50, { message: 'Voucher code must be between 1 and 50 characters' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000, { message: 'Description must be between 1 and 1000 characters' })
  description: string;

  @IsEnum(VoucherType, { message: 'Type must be one of: PERCENTAGE, FIXED' })
  @IsNotEmpty()
  type: VoucherType;

  @IsInt()
  @IsNotEmpty()
  @Min(0, { message: 'Value must be 0 or greater' })
  @Max(100, { message: 'Value must be at most 100 for percentage type' })
  value: number;

  @IsInt()
  @Min(0, { message: 'Max discount must be 0 or greater' })
  @Max(999999999, { message: 'Max discount must be less than 1 billion' })
  @IsOptional()
  maxDiscount?: number;

  @IsInt()
  @Min(0, { message: 'Min purchase must be 0 or greater' })
  @Max(999999999, { message: 'Min purchase must be less than 1 billion' })
  @IsOptional()
  minPurchase?: number;

  @IsInt()
  @Min(1, { message: 'Usage limit must be at least 1' })
  @Max(999999, { message: 'Usage limit must be less than 1 million' })
  @IsOptional()
  usageLimit?: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  expiry: Date;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  storeId: number;
}
