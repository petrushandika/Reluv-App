import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { CreateVariantDto } from './create-variant.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, {
    message: 'Product name must be between 1 and 255 characters',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255, { message: 'Slug must be between 1 and 255 characters' })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10000, {
    message: 'Description must be between 1 and 10000 characters',
  })
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  @ArrayMinSize(1, { message: 'At least one image is required' })
  images: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean = true;

  @IsBoolean()
  @IsOptional()
  isPreloved?: boolean = true;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Category ID must be a positive integer' })
  categoryId: number;

  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Parent category ID must be a positive integer' })
  parentCategoryId?: number;

  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Child category ID must be a positive integer' })
  childCategoryId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @ArrayMinSize(1, { message: 'At least one variant is required' })
  variants: CreateVariantDto[];
}
