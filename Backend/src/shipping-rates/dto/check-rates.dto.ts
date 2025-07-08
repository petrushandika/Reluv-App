import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CheckRatesItemDto } from './check-rates-item.dto';

export class CheckRatesDto {
  @IsString()
  @IsNotEmpty()
  origin_area_id: string;

  @IsString()
  @IsNotEmpty()
  destination_area_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckRatesItemDto)
  items: CheckRatesItemDto[];
}
