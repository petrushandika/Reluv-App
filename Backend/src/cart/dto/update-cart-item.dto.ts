import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(999, { message: 'Quantity must be at most 999' })
  quantity: number;
}
