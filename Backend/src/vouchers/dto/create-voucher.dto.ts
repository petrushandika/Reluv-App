import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { VoucherType } from '@prisma/client';

export class CreateVoucherDto {
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
  @Min(0)
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

  @IsDateString()
  @IsNotEmpty()
  expiry: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
