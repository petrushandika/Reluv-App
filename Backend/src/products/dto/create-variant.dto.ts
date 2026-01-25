import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Condition } from '@prisma/client';

export class CreateVariantDto {
  @IsString()
  @IsOptional()
  @Length(0, 50, { message: 'Size must be at most 50 characters' })
  size?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50, { message: 'Color must be at most 50 characters' })
  color?: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0, { message: 'Price must be 0 or greater' })
  @Max(999999999, { message: 'Price must be less than 1 billion' })
  price: number;

  @IsInt()
  @IsOptional()
  @Min(0, { message: 'Compare at price must be 0 or greater' })
  @Max(999999999, { message: 'Compare at price must be less than 1 billion' })
  compareAtPrice?: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0, { message: 'Stock must be 0 or greater' })
  @Max(999999, { message: 'Stock must be less than 1 million' })
  stock: number;

  @IsEnum(Condition, {
    message: 'Condition must be one of: NEW, LIKE_NEW, GOOD, FAIR, POOR',
  })
  @IsNotEmpty()
  condition: Condition;

  @IsString()
  @IsOptional()
  @Length(0, 500, { message: 'Condition note must be at most 500 characters' })
  conditionNote?: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Weight must be at least 1 gram' })
  @Max(999999, { message: 'Weight must be less than 1 million grams' })
  weight: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Length must be at least 1 cm' })
  @Max(9999, { message: 'Length must be less than 10000 cm' })
  length: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Width must be at least 1 cm' })
  @Max(9999, { message: 'Width must be less than 10000 cm' })
  width: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Height must be at least 1 cm' })
  @Max(9999, { message: 'Height must be less than 10000 cm' })
  height: number;
}
