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

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, createProductDto: CreateProductDto) {
    const { variants, categoryId, ...productData } = createProductDto;

    const store = await this.prisma.store.findUnique({
      where: { userId: user.id },
    });
    if (!store) {
      throw new ForbiddenException(
        'You do not own a store to add products to.',
      );
    }

    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: productData.slug },
    });
    if (existingProduct) {
      throw new ConflictException(
        `Product with slug '${productData.slug}' already exists`,
      );
    }

    const dataToCreate: Prisma.ProductCreateInput = {
      ...productData,
      seller: { connect: { id: user.id } }, // Ambil sellerId dari token
      store: { connect: { id: store.id } }, // Ambil storeId dari toko milik user
      category: { connect: { id: categoryId } },
      variants: {
        create: variants,
      },
    };

    return this.prisma.product.create({
      data: dataToCreate,
    });
  }

  async findAll(queryDto: QueryProductDto) {
    const { page = 1, limit = 10, categoryId, sellerId, search } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isPublished: true,
      categoryId: categoryId,
      sellerId: sellerId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        category: true,
        store: { select: { name: true, slug: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
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
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => {
        console.error(`Failed to update view count for product ${id}`, err);
      });

    return product;
  }

  async update(user: User, id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (product.sellerId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this product.',
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(user: User, id: number) {
    const product = await this.findOne(id);

    if (product.sellerId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this product.',
      );
    }

    await this.prisma.product.delete({
      where: { id },
    });
    return { message: `Product with ID ${id} has been successfully deleted.` };
  }
}
