import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(
    authorId: number,
    productId: number,
    createReviewDto: CreateReviewDto,
  ) {
    const [product, validOrder] = await Promise.all([
      this.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, sellerId: true },
      }),
      createReviewDto.orderId
        ? this.prisma.order.findFirst({
            where: {
              id: createReviewDto.orderId,
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
            select: { id: true },
          })
        : this.prisma.order.findFirst({
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
            select: { id: true },
            orderBy: { createdAt: 'desc' },
          }),
    ]);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    if (!validOrder) {
      throw new ForbiddenException(
        'You can only review products you have purchased and received.',
      );
    }

    const existingReview = await this.prisma.review.findUnique({
      where: {
        productId_authorId: {
          productId,
          authorId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this product.');
    }

    try {
      return await this.prisma.review.create({
        data: {
          rating: createReviewDto.rating,
          comment: createReviewDto.comment,
          images: createReviewDto.images || [],
          authorId: authorId,
          productId: productId,
          orderId: validOrder.id,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
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
      select: {
        id: true,
        rating: true,
        comment: true,
        images: true,
        reply: true,
        editCount: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        replyAuthor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true,
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

  async update(
    authorId: number,
    reviewId: number,
    updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        id: true,
        authorId: true,
        editCount: true,
        productId: true,
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found.`);
    }

    if (review.authorId !== authorId) {
      throw new ForbiddenException(
        'You can only edit your own reviews.',
      );
    }

    if (review.editCount >= 3) {
      throw new BadRequestException(
        'You have reached the maximum number of edits (3 times).',
      );
    }

    return await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: updateReviewDto.rating,
        comment: updateReviewDto.comment,
        images: updateReviewDto.images,
        editCount: { increment: 1 },
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        replyAuthor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async reply(
    userId: number,
    reviewId: number,
    replyReviewDto: ReplyReviewDto,
  ) {
    const [review, userStore] = await Promise.all([
      this.prisma.review.findUnique({
        where: { id: reviewId },
        include: {
          product: {
            select: {
              sellerId: true,
              storeId: true,
            },
          },
        },
      }),
      this.prisma.store.findUnique({
        where: { userId },
        select: { id: true },
      }),
    ]);

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found.`);
    }

    if (!userStore) {
      throw new ForbiddenException(
        'Only store owners can reply to reviews.',
      );
    }

    if (review.product.storeId !== userStore.id) {
      throw new ForbiddenException(
        'You can only reply to reviews on products from your store.',
      );
    }

    if (review.reply) {
      throw new ConflictException('You have already replied to this review.');
    }

    return await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        reply: replyReviewDto.reply,
        replyAuthor: { connect: { id: userId } },
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        replyAuthor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(reviewId: number) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        replyAuthor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found.`);
    }

    return review;
  }

  async findAllForSeller(userId: number) {
    return this.prisma.review.findMany({
      where: {
        product: {
          sellerId: userId,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findStatsForSeller(userId: number) {
    const reviews = await this.prisma.review.findMany({
      where: {
        product: {
          sellerId: userId,
        },
      },
      select: {
        rating: true,
        reply: true,
      },
    });

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;
    const pendingReplies = reviews.filter((r) => !r.reply).length;

    const ratingDistribution = {
      1: reviews.filter((r) => r.rating === 1).length,
      2: reviews.filter((r) => r.rating === 2).length,
      3: reviews.filter((r) => r.rating === 3).length,
      4: reviews.filter((r) => r.rating === 4).length,
      5: reviews.filter((r) => r.rating === 5).length,
    };

    return {
      totalReviews,
      avgRating: parseFloat(avgRating.toFixed(1)),
      pendingReplies,
      ratingDistribution,
    };
  }
}
