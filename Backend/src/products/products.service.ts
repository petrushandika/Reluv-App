import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { variants, sellerId, categoryId, storeId, ...productData } =
      createProductDto;

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
      seller: { connect: { id: sellerId } },
      category: { connect: { id: categoryId } },
      store: { connect: { id: storeId } },
      variants: {
        create: variants,
      },
      ...(storeId && { store: { connect: { id: storeId } } }),
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
        seller: { select: { id: true, firstName: true, lastName: true } },
        category: true,
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.product.delete({
      where: { id },
    });
    return { message: `Product with ID ${id} has been successfully deleted.` };
  }
}
