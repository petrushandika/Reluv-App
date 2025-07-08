import { IsInt, IsNotEmpty } from 'class-validator';

export class CheckRatesFromCartDto {
  @IsInt()
  @IsNotEmpty()
  destinationLocationId: number;
}
