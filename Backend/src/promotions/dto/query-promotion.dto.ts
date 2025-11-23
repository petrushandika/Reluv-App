import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { PromotionType } from './create-promotion.dto';

export class QueryPromotionDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(PromotionType)
  type?: PromotionType;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  storeId?: number;
}
