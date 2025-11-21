import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, Length } from 'class-validator';

export class QueryProductDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must be at most 100' })
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'Category ID must be a positive integer' })
  categoryId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'Seller ID must be a positive integer' })
  sellerId?: number;

  @IsOptional()
  @IsString()
  @Length(0, 255, { message: 'Search query must be at most 255 characters' })
  search?: string;
}
