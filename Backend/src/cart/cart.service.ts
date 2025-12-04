import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        select: { id: true },
      });
    }
    return cart;
  }

  async getMyCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    return this.prisma.cart.findUnique({
      where: { id: cart.id },
      select: {
        id: true,
        items: {
          select: {
            id: true,
            quantity: true,
            createdAt: true,
            variant: {
              select: {
                id: true,
                size: true,
                color: true,
                price: true,
                compareAtPrice: true,
                stock: true,
                condition: true,
                image: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: true,
                    store: {
                      select: {
                        id: true,
                        name: true,
                        slug: true,
                        location: {
                          select: {
                            id: true,
                            city: true,
                            province: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async addItem(userId: number, addToCartDto: AddToCartDto) {
    const { variantId, quantity } = addToCartDto;
    const cart = await this.getOrCreateCart(userId);

    const variant = await this.prisma.variant.findUnique({
      where: { id: variantId },
      select: { 
        id: true, 
        stock: true,
        product: {
          select: {
            id: true,
            sellerId: true,
          },
        },
      },
    });
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found.`);
    }
    if (variant.product.sellerId === userId) {
      throw new ForbiddenException(
        'You cannot add your own product to the cart.',
      );
    }
    if (variant.stock < quantity) {
      throw new NotFoundException(`Not enough stock for this variant.`);
    }

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
      select: { id: true },
    });

    if (existingCartItem) {
      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity,
        },
      });
    }
  }

  async updateItemQuantity(
    userId: number,
    cartItemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, cart: { userId } },
      select: {
        id: true,
        variant: {
          select: {
            stock: true,
          },
        },
      },
    });

    if (!cartItem) {
      throw new ForbiddenException('This cart item does not belong to you.');
    }

    if (cartItem.variant.stock < updateCartItemDto.quantity) {
      throw new ConflictException(
        `Not enough stock. Only ${cartItem.variant.stock} items left.`,
      );
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: updateCartItemDto.quantity },
    });
  }

  async removeItem(userId: number, cartItemId: number) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, cart: { userId } },
      select: { id: true },
    });

    if (!cartItem) {
      throw new ForbiddenException('This cart item does not belong to you.');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return { message: 'Item removed from cart successfully.' };
  }
}
