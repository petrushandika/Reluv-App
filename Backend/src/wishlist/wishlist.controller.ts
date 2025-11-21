import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getMyWishlist(@GetUser() user: User) {
    return this.wishlistService.getMyWishlist(user.id);
  }

  @Get('status/:productId')
  @HttpCode(HttpStatus.OK)
  checkWishlistStatus(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.checkStatus(user.id, productId);
  }

  @Post(':productId')
  @HttpCode(HttpStatus.CREATED)
  addToWishlist(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.addToWishlist(user.id, productId);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  removeFromWishlist(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.removeFromWishlist(user.id, productId);
  }
}
