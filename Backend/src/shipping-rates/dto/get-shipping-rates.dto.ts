import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class GetShippingRatesDto {
  @IsString()
  @IsNotEmpty()
  originAreaId: string;

  @IsString()
  @IsNotEmpty()
  destinationAreaId: string;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  weight: number; // in grams
}
