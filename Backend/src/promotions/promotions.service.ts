import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { QueryPromotionDto } from './dto/query-promotion.dto';
import { User } from '@prisma/client';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, createPromotionDto: CreatePromotionDto) {
    const { storeId, productIds, ...promotionData } = createPromotionDto;

    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, userId: true },
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found.`);
    }

    if (store.userId !== user.id) {
      throw new ForbiddenException(
        'You are not the owner of this store. Only the store owner can create promotions for this store.',
      );
    }

    if (createPromotionDto.startDate >= createPromotionDto.endDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    if (productIds && productIds.length > 0) {
      const products = await this.prisma.product.findMany({
        where: {
          id: { in: productIds },
          storeId: storeId,
        },
        select: { id: true },
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException(
          'Some products not found or do not belong to this store.',
        );
      }
    }

    return this.prisma.promotion.create({
      data: {
        ...promotionData,
        store: { connect: { id: storeId } },
        products: productIds
          ? { connect: productIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        store: {
          select: { id: true, name: true, slug: true },
        },
        products: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findAll(queryDto: QueryPromotionDto) {
    const { page = 1, limit = 10, type, storeId } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    };

    if (type) where.type = type;
    if (storeId) where.storeId = storeId;

    const [promotions, total] = await this.prisma.$transaction([
      this.prisma.promotion.findMany({
        where,
        skip,
        take: limit,
        include: {
          store: {
            select: { id: true, name: true, slug: true },
          },
          products: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.promotion.count({ where }),
    ]);

    return {
      data: promotions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        store: true,
        products: true,
      },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found.`);
    }

    return promotion;
  }

  async update(user: User, id: number, updatePromotionDto: UpdatePromotionDto) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: { store: { select: { userId: true } } },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found.`);
    }

    if (promotion.store.userId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this promotion.',
      );
    }

    if (updatePromotionDto.startDate && updatePromotionDto.endDate) {
      if (updatePromotionDto.startDate >= updatePromotionDto.endDate) {
        throw new BadRequestException('endDate must be after startDate');
      }
    }

    const { productIds, ...updateData } = updatePromotionDto;

    return this.prisma.promotion.update({
      where: { id },
      data: {
        ...updateData,
        products: productIds
          ? { set: productIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        store: {
          select: { id: true, name: true, slug: true },
        },
        products: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async remove(user: User, id: number) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: { store: { select: { userId: true } } },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found.`);
    }

    if (promotion.store.userId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this promotion.',
      );
    }

    return this.prisma.promotion.delete({ where: { id } });
  }
}
