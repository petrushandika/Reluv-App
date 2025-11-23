import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDate,
  IsBoolean,
  IsInt,
  IsArray,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PromotionType {
  FLASH_SALE = 'FLASH_SALE',
  BOGO = 'BOGO',
  BUNDLE = 'BUNDLE',
  SEASONAL = 'SEASONAL',
  CUSTOM = 'CUSTOM',
}

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsEnum(PromotionType)
  @IsNotEmpty()
  type: PromotionType;

  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discount?: number;

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

  @IsInt()
  @IsNotEmpty()
  storeId: number;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  productIds?: number[];
}
