import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CheckRatesItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  value: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  weight: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  length: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  width: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  height: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
