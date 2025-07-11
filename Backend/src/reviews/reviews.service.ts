import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(
    authorId: number,
    productId: number,
    createReviewDto: CreateReviewDto,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const validOrder = await this.prisma.order.findFirst({
      where: {
        buyerId: authorId,
        status: { in: [OrderStatus.DELIVERED, OrderStatus.COMPLETED] },
        items: {
          some: {
            variant: {
              productId: productId,
            },
          },
        },
      },
    });

    if (!validOrder) {
      throw new ForbiddenException(
        'You can only review products you have purchased and received.',
      );
    }

    try {
      return await this.prisma.review.create({
        data: {
          ...createReviewDto,
          author: { connect: { id: authorId } },
          product: { connect: { id: productId } },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('You have already reviewed this product.');
      }
      throw error;
    }
  }

  async findAllForProduct(productId: number) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: { select: { avatar: true } },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
