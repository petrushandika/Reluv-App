import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class CreateGeocodeDto {}

export class ReverseGeocodeQueryDto {
  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @IsLongitude()
  @IsNotEmpty()
  lon: number;
}
