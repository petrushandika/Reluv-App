import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  recipient?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  subDistrict?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
