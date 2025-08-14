import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

// DTO baru untuk menangani payload alamat baru
class DestinationAddressDto {
  @IsString()
  @IsNotEmpty()
  provinceName: string;

  @IsString()
  @IsNotEmpty()
  regencyName: string;

  @IsString()
  @IsNotEmpty()
  districtName: string;

  @IsString()
  @IsNotEmpty()
  villageName: string;
}

export class CheckRatesFromCartDto {
  @IsInt()
  @IsOptional()
  @ValidateIf((o) => !o.destination)
  destinationLocationId?: number;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => DestinationAddressDto)
  @ValidateIf((o) => !o.destinationLocationId)
  destination?: DestinationAddressDto;
}
