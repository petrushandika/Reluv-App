import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getMyWishlist(userId: number) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            images: true,
            isPreloved: true,
            viewCount: true,
            createdAt: true,
            variants: {
              where: { isActive: true },
              orderBy: { price: 'asc' },
              select: {
                id: true,
                size: true,
                color: true,
                price: true,
                compareAtPrice: true,
                stock: true,
                condition: true,
                image: true,
              },
            },
            store: {
              select: {
                id: true,
                name: true,
                slug: true,
                isVerified: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addToWishlist(userId: number, productId: number) {
    const [product, existingWishlistItem] = await Promise.all([
      this.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true },
      }),
      this.prisma.wishlist.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        select: { id: true },
      }),
    ]);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    if (existingWishlistItem) {
      throw new ConflictException('This product is already in your wishlist.');
    }

    return this.prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async checkStatus(userId: number, productId: number) {
    const wishlistItem = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      select: { id: true },
    });

    return { isInWishlist: !!wishlistItem };
  }

  async removeFromWishlist(userId: number, productId: number) {
    try {
      await this.prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
      return { message: 'Product removed from wishlist successfully.' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('This product is not in your wishlist.');
      }
      throw error;
    }
  }
}
