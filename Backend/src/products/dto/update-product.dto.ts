import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
  ArrayMinSize,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @Length(1, 255, {
    message: 'Product name must be between 1 and 255 characters',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255, { message: 'Slug must be between 1 and 255 characters' })
  slug?: string;

  @IsString()
  @IsOptional()
  @Length(1, 10000, {
    message: 'Description must be between 1 and 10000 characters',
  })
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  @IsOptional()
  @ArrayMinSize(1, { message: 'At least one image is required when provided' })
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsBoolean()
  @IsOptional()
  isPreloved?: boolean;

  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Category ID must be a positive integer' })
  categoryId?: number;

  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Parent category ID must be a positive integer' })
  parentCategoryId?: number;

  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Child category ID must be a positive integer' })
  childCategoryId?: number;
}
