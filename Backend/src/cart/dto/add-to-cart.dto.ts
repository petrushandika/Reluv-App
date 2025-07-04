import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  @IsNotEmpty()
  variantId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
