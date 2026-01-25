import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Length,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, {
    message: 'Category name must be between 1 and 255 characters',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255, { message: 'Slug must be between 1 and 255 characters' })
  slug: string;

  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Parent ID must be a positive integer' })
  parentId?: number;
}
