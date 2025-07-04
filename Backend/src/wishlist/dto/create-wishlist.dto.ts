import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateWishlistDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;
}
