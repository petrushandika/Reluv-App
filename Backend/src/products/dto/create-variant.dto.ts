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
  name?: string;

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
}
