import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  addToWishlist(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistService.addToWishlist(
      user.id,
      createWishlistDto.productId,
    );
  }

  @Get('status/:productId')
  checkWishlistStatus(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.checkStatus(user.id, productId);
  }

  @Get()
  getMyWishlist(@GetUser() user: User) {
    return this.wishlistService.getMyWishlist(user.id);
  }

  @Delete(':productId')
  removeFromWishlist(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.removeFromWishlist(user.id, productId);
  }
}
