import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Condition } from '@prisma/client';

export class CreateVariantDto {
  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  stock: number;

  @IsEnum(Condition)
  @IsNotEmpty()
  condition: Condition;

  @IsString()
  @IsOptional()
  conditionNote?: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  weight: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  length: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  width: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  height: number;
}
