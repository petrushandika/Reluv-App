import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminCreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsOptional()
  locationId?: number;
}
