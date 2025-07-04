import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UpsertShippingRateDto {
  @IsString()
  @IsNotEmpty()
  originAreaId: string;

  @IsString()
  @IsNotEmpty()
  destinationAreaId: string;

  @IsString()
  @IsNotEmpty()
  courierCode: string;

  @IsString()
  @IsNotEmpty()
  serviceCode: string;

  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  minWeight: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  maxWeight: number;

  @IsString()
  @IsNotEmpty()
  estimatedDays: string;
}
