import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  locationId: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  shippingCost: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
