import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsBoolean()
  @IsOptional()
  isPreloved?: boolean;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  weight?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  length?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  width?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  height?: number;
}
