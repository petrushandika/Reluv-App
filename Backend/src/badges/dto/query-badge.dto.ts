import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsEnum, Min, Max } from 'class-validator';
import { BadgeType } from './create-badge.dto';

export class QueryBadgeDto {
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
  @IsEnum(BadgeType)
  type?: BadgeType;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  storeId?: number;
}
