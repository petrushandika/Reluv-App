import { Type } from 'class-transformer';
import {
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CheckRatesItemDto } from './check-rates-item.dto';

export class CheckRatesByCoordsDto {
  @IsLatitude()
  @IsNotEmpty()
  origin_latitude: number;

  @IsLongitude()
  @IsNotEmpty()
  origin_longitude: number;

  @IsLatitude()
  @IsNotEmpty()
  destination_latitude: number;

  @IsLongitude()
  @IsNotEmpty()
  destination_longitude: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckRatesItemDto)
  items: CheckRatesItemDto[];
}
