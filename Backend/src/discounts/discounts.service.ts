import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { QueryDiscountDto } from './dto/query-discount.dto';
import { User } from '@prisma/client';

enum DiscountScope {
  GLOBAL = 'GLOBAL',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
  STORE = 'STORE',
}

@Injectable()
export class DiscountsService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, createDiscountDto: CreateDiscountDto) {
    const { scope, categoryId, productId, storeId, ...discountData } =
      createDiscountDto;

    if (scope === DiscountScope.CATEGORY && !categoryId) {
      throw new BadRequestException('categoryId is required for CATEGORY scope');
    }
    if (scope === DiscountScope.PRODUCT && !productId) {
      throw new BadRequestException('productId is required for PRODUCT scope');
    }
    if (scope === DiscountScope.STORE && !storeId) {
      throw new BadRequestException('storeId is required for STORE scope');
    }

    if (scope === DiscountScope.STORE && storeId) {
      const store = await this.prisma.store.findUnique({
        where: { id: storeId },
        select: { id: true, userId: true },
      });

      if (!store) {
        throw new NotFoundException(`Store with ID ${storeId} not found.`);
      }

      if (store.userId !== user.id) {
        throw new ForbiddenException(
          'You are not the owner of this store. Only the store owner can create discounts for this store.',
        );
      }
    }

    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found.`);
      }
    }

    if (productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found.`);
      }
    }

    if (createDiscountDto.startDate >= createDiscountDto.endDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    return this.prisma.discount.create({
      data: {
        ...discountData,
        scope,
        categoryId: scope === DiscountScope.CATEGORY ? categoryId : null,
        productId: scope === DiscountScope.PRODUCT ? productId : null,
        storeId: scope === DiscountScope.STORE ? storeId : null,
      },
    });
  }

  async findAll(queryDto: QueryDiscountDto) {
    const { page = 1, limit = 10, scope, type, storeId, categoryId, productId } =
      queryDto;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    };

    if (scope) where.scope = scope;
    if (type) where.type = type;
    if (storeId) where.storeId = storeId;
    if (categoryId) where.categoryId = categoryId;
    if (productId) where.productId = productId;

    const [discounts, total] = await this.prisma.$transaction([
      this.prisma.discount.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          product: {
            select: { id: true, name: true, slug: true },
          },
          store: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.discount.count({ where }),
    ]);

    return {
      data: discounts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
      include: {
        category: true,
        product: true,
        store: true,
      },
    });

    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found.`);
    }

    return discount;
  }

  async update(user: User, id: number, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
      include: { store: { select: { userId: true } } },
    });

    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found.`);
    }

    if (discount.scope === DiscountScope.STORE && discount.storeId) {
      if (discount.store?.userId !== user.id) {
        throw new ForbiddenException(
          'You are not authorized to update this discount.',
        );
      }
    }

    if (updateDiscountDto.startDate && updateDiscountDto.endDate) {
      if (updateDiscountDto.startDate >= updateDiscountDto.endDate) {
        throw new BadRequestException('endDate must be after startDate');
      }
    }

    return this.prisma.discount.update({
      where: { id },
      data: updateDiscountDto,
    });
  }

  async remove(user: User, id: number) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
      include: { store: { select: { userId: true } } },
    });

    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found.`);
    }

    if (discount.scope === DiscountScope.STORE && discount.storeId) {
      if (discount.store?.userId !== user.id) {
        throw new ForbiddenException(
          'You are not authorized to delete this discount.',
        );
      }
    }

    return this.prisma.discount.delete({ where: { id } });
  }

  async applyDiscount(
    productId: number,
    categoryId: number,
    storeId: number | null,
    subtotal: number,
  ): Promise<{ discountAmount: number; discountId: number | null }> {
    const now = new Date();

    const allDiscounts = await this.prisma.discount.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
        OR: [
          { scope: DiscountScope.PRODUCT, productId },
          { scope: DiscountScope.CATEGORY, categoryId },
          ...(storeId ? [{ scope: DiscountScope.STORE, storeId }] : []),
          { scope: DiscountScope.GLOBAL },
        ],
      },
    });

    if (allDiscounts.length === 0) {
      return { discountAmount: 0, discountId: null };
    }

    const priorityOrder = [
      DiscountScope.PRODUCT,
      DiscountScope.CATEGORY,
      DiscountScope.STORE,
      DiscountScope.GLOBAL,
    ];

    const sortedDiscounts = allDiscounts.sort((a, b) => {
      const aPriority = priorityOrder.indexOf(a.scope);
      const bPriority = priorityOrder.indexOf(b.scope);
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return b.value - a.value;
    });

    const discount = sortedDiscounts[0];

    if (discount.minPurchase && subtotal < discount.minPurchase) {
      return { discountAmount: 0, discountId: null };
    }

    if (
      discount.usageLimit &&
      discount.usedCount >= discount.usageLimit
    ) {
      return { discountAmount: 0, discountId: null };
    }

    let discountAmount = 0;
    if (discount.type === 'PERCENTAGE') {
      discountAmount = Math.floor((subtotal * discount.value) / 100);
      if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
        discountAmount = discount.maxDiscount;
      }
    } else if (discount.type === 'FIXED_AMOUNT') {
      discountAmount = discount.value;
    } else if (discount.type === 'FREE_SHIPPING') {
      discountAmount = 0;
    }

    if (discountAmount > 0) {
      await this.prisma.discount.update({
        where: { id: discount.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    return { discountAmount, discountId: discount.id };
  }
}
