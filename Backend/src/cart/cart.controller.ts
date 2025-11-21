import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getMyCart(@GetUser() user: User) {
    return this.cartService.getMyCart(user.id);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  addItem(
    @GetUser() user: User,
    @Body(new ValidationPipe()) addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addItem(user.id, addToCartDto);
  }

  @Patch('items/:id')
  @HttpCode(HttpStatus.OK)
  updateItemQuantity(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) cartItemId: number,
    @Body(new ValidationPipe()) updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(
      user.id,
      cartItemId,
      updateCartItemDto,
    );
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.OK)
  removeItem(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) cartItemId: number,
  ) {
    return this.cartService.removeItem(user.id, cartItemId);
  }
}
