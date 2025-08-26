import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VoucherType } from '@prisma/client';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(VoucherType)
  @IsNotEmpty()
  type: VoucherType;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  maxDiscount?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  minPurchase?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  usageLimit?: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  expiry: Date;
}
