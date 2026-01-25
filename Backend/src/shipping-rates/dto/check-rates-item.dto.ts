import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Max,
  Length,
} from 'class-validator';

export class CheckRatesItemDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, { message: 'Item name must be between 1 and 255 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 500, { message: 'Description must be at most 500 characters' })
  description?: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0, { message: 'Value must be 0 or greater' })
  @Max(999999999, { message: 'Value must be less than 1 billion' })
  value: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Weight must be at least 1 gram' })
  @Max(999999, { message: 'Weight must be less than 1 million grams' })
  weight: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Length must be at least 1 cm' })
  @Max(9999, { message: 'Length must be less than 10000 cm' })
  length: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Width must be at least 1 cm' })
  @Max(9999, { message: 'Width must be less than 10000 cm' })
  width: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Height must be at least 1 cm' })
  @Max(9999, { message: 'Height must be less than 10000 cm' })
  height: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(999, { message: 'Quantity must be at most 999' })
  quantity: number;
}
