import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma, User } from '@prisma/client';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private async checkProductOwnership(productId: number, userId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    if (product.sellerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to manage this product.',
      );
    }
    return product;
  }

  async create(user: User, createProductDto: CreateProductDto) {
    const { variants, categoryId, ...productData } = createProductDto;

    const categoryExists = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }

    const store = await this.prisma.store.findUnique({
      where: { userId: user.id },
    });

    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: productData.slug },
    });
    if (existingProduct) {
      throw new ConflictException(
        `Product with slug '${productData.slug}' already exists`,
      );
    }

    return this.prisma.product.create({
      data: {
        ...productData,
        seller: { connect: { id: user.id } },
        category: { connect: { id: categoryId } },
        ...(store && { store: { connect: { id: store.id } } }),
        variants: {
          create: variants,
        },
      },
    });
  }

  async findAll(queryDto: QueryProductDto) {
    const { page = 1, limit = 10, categoryId, sellerId, search } = queryDto;
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPublished: true,
      categoryId,
      sellerId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          variants: { where: { isActive: true }, orderBy: { price: 'asc' } },
          category: true,
          store: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, firstName: true } },
        category: true,
        store: true,
        variants: { where: { isActive: true } },
        reviews: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.prisma.product
      .update({ where: { id }, data: { viewCount: { increment: 1 } } })
      .catch(console.error);
    return product;
  }

  async update(user: User, id: number, updateProductDto: UpdateProductDto) {
    await this.checkProductOwnership(id, user.id);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(user: User, id: number) {
    await this.checkProductOwnership(id, user.id);
    return this.prisma.product.delete({ where: { id } });
  }

  async addVariant(
    user: User,
    productId: number,
    createVariantDto: CreateVariantDto,
  ) {
    await this.checkProductOwnership(productId, user.id);
    return this.prisma.variant.create({
      data: {
        ...createVariantDto,
        product: { connect: { id: productId } },
      },
    });
  }

  async updateVariant(
    user: User,
    productId: number,
    variantId: number,
    updateVariantDto: UpdateVariantDto,
  ) {
    await this.checkProductOwnership(productId, user.id);
    return this.prisma.variant.update({
      where: { id: variantId, productId: productId },
      data: updateVariantDto,
    });
  }

  async removeVariant(user: User, productId: number, variantId: number) {
    await this.checkProductOwnership(productId, user.id);
    return this.prisma.variant.delete({
      where: { id: variantId, productId: productId },
    });
  }
}
