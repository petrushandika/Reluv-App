import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
  Length,
} from 'class-validator';

export enum BadgeType {
  VERIFIED = 'VERIFIED',
  PREMIUM = 'PREMIUM',
  FEATURED = 'FEATURED',
  TRENDING = 'TRENDING',
  BEST_SELLER = 'BEST_SELLER',
  NEW_STORE = 'NEW_STORE',
  CUSTOM = 'CUSTOM',
}

export class CreateBadgeDto {
  @IsEnum(BadgeType)
  @IsNotEmpty()
  type: BadgeType;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNotEmpty()
  storeId: number;
}
