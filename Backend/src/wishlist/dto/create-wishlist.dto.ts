import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateWishlistDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Product ID must be a positive integer' })
  productId: number;
}
