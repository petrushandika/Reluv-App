import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class AdminCreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, {
    message: 'Store name must be between 1 and 255 characters',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255, { message: 'Slug must be between 1 and 255 characters' })
  slug: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'User ID must be a positive integer' })
  userId: number;

  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Location ID must be a positive integer' })
  locationId?: number;
}
