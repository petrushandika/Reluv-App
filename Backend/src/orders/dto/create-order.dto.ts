import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, Length } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Location ID must be a positive integer' })
  locationId: number;

  @IsInt()
  @Min(0, { message: 'Shipping cost must be 0 or greater' })
  @Max(999999999, { message: 'Shipping cost must be less than 1 billion' })
  @IsNotEmpty()
  shippingCost: number;

  @IsString()
  @IsOptional()
  @Length(0, 1000, { message: 'Notes must be at most 1000 characters' })
  notes?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50, { message: 'Voucher code must be at most 50 characters' })
  voucherCode?: string;
}
