import { IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CheckRatesFromCartDto {
  @IsInt()
  @IsOptional()
  @ValidateIf((o: CheckRatesFromCartDto) => !o.destinationAreaId)
  destinationLocationId?: number;

  @IsString()
  @IsOptional()
  @ValidateIf((o: CheckRatesFromCartDto) => !o.destinationLocationId)
  destinationAreaId?: string;
}
