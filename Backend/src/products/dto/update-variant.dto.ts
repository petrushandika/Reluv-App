import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Condition } from '@prisma/client';

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsEnum(Condition)
  @IsOptional()
  condition?: Condition;

  @IsString()
  @IsOptional()
  conditionNote?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  weight?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  length?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  width?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  height?: number;
}
