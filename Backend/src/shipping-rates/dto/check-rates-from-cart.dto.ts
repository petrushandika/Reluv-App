import { IsInt, IsOptional, IsString, ValidateIf, Min, Length } from 'class-validator';

export class CheckRatesFromCartDto {
  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Location ID must be a positive integer' })
  @ValidateIf((o: CheckRatesFromCartDto) => !o.destinationAreaId)
  destinationLocationId?: number;

  @IsString()
  @IsOptional()
  @Length(1, 100, { message: 'Area ID must be between 1 and 100 characters' })
  @ValidateIf((o: CheckRatesFromCartDto) => !o.destinationLocationId)
  destinationAreaId?: string;
}
