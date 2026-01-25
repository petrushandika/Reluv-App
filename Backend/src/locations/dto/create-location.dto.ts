import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  Max,
} from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'Label must be between 1 and 100 characters' })
  label: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100, {
    message: 'Recipient name must be between 1 and 100 characters',
  })
  recipient: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20, { message: 'Phone must be between 1 and 20 characters' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'Province must be between 1 and 100 characters' })
  province: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'City must be between 1 and 100 characters' })
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'District must be between 1 and 100 characters' })
  district: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100, {
    message: 'Sub district must be between 1 and 100 characters',
  })
  subDistrict: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10, { message: 'Postal code must be between 1 and 10 characters' })
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500, { message: 'Address must be between 1 and 500 characters' })
  address: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean = false;

  @IsString()
  @IsOptional()
  @Length(0, 100, {
    message: 'Biteship area ID must be at most 100 characters',
  })
  biteship_area_id?: string;

  @IsNumber()
  @IsOptional()
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  longitude?: number;
}
