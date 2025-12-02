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
      select: { id: true, sellerId: true },
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
    const {
      variants,
      categoryId,
      parentCategoryId,
      childCategoryId,
      ...productData
    } = createProductDto;

    const storeId = (productData as any).storeId;

    const [
      categoryExists,
      parentCategoryExists,
      childCategoryExists,
      store,
      existingProduct,
      storeToUse,
    ] = await Promise.all([
      this.prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      }),
      parentCategoryId
        ? this.prisma.category.findUnique({
            where: { id: parentCategoryId },
            select: { id: true },
          })
        : Promise.resolve(null),
      childCategoryId
        ? this.prisma.category.findUnique({
            where: { id: childCategoryId },
            select: { id: true },
          })
        : Promise.resolve(null),
      this.prisma.store.findUnique({
        where: { userId: user.id },
        select: { id: true },
      }),
      this.prisma.product.findUnique({
        where: { slug: productData.slug },
        select: { id: true },
      }),
      storeId
        ? this.prisma.store.findUnique({
            where: { id: storeId },
            select: { id: true, userId: true },
          })
        : Promise.resolve(null),
    ]);

    if (!categoryExists) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }

    if (parentCategoryId && !parentCategoryExists) {
      throw new NotFoundException(
        `Parent category with ID ${parentCategoryId} not found.`,
      );
    }

    if (childCategoryId && !childCategoryExists) {
      throw new NotFoundException(
        `Child category with ID ${childCategoryId} not found.`,
      );
    }

    if (existingProduct) {
      throw new ConflictException(
        `Product with slug '${productData.slug}' already exists`,
      );
    }

    if (storeId) {
      if (!storeToUse) {
        throw new NotFoundException(`Store with ID ${storeId} not found.`);
      }
      if (storeToUse.userId !== user.id) {
        throw new ForbiddenException(
          'You are not the owner of this store. Only the store owner can create products for this store.',
        );
      }
    }

    return this.prisma.product.create({
      data: {
        ...productData,
        seller: { connect: { id: user.id } },
        category: { connect: { id: categoryId } },
        ...(parentCategoryId && {
          parentCategory: { connect: { id: parentCategoryId } },
        }),
        ...(childCategoryId && {
          childCategory: { connect: { id: childCategoryId } },
        }),
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
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
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
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findMyProducts(user: User, queryDto: QueryProductDto) {
    const { page = 1, limit = 100, categoryId, search } = queryDto;
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {
      sellerId: user.id,
      categoryId,
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
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          images: true,
          isPreloved: true,
          isPublished: true,
          isActive: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
          variants: {
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
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return products;
  }

  async findOneBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { 
        slug,
        isActive: true,
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        images: true,
        isPreloved: true,
        isPublished: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        parentCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        childCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
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
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            size: true,
            color: true,
            sku: true,
            image: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            condition: true,
            conditionNote: true,
            weight: true,
            length: true,
            width: true,
            height: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            images: true,
            createdAt: true,
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
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    this.prisma.product
      .update({ where: { slug }, data: { viewCount: { increment: 1 } } })
      .catch(() => {});
    return product;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: { 
        id,
        isActive: true,
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        images: true,
        isPreloved: true,
        isPublished: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        parentCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        childCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
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
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            size: true,
            color: true,
            sku: true,
            image: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            condition: true,
            conditionNote: true,
            weight: true,
            length: true,
            width: true,
            height: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            images: true,
            createdAt: true,
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
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.prisma.product
      .update({ where: { id }, data: { viewCount: { increment: 1 } } })
      .catch(() => {});
    return product;
  }

  async update(user: User, id: number, updateProductDto: UpdateProductDto) {
    await this.checkProductOwnership(id, user.id);

    const { 
      categoryId, 
      parentCategoryId, 
      childCategoryId, 
      isActive,
      ...otherData 
    } = updateProductDto;

    const storeId = (otherData as any).storeId;
    
    if ('storeId' in otherData) {
      delete (otherData as any).storeId;
    }

    const [parentCategoryExists, childCategoryExists, storeToUse] =
      await Promise.all([
        parentCategoryId
          ? this.prisma.category.findUnique({
              where: { id: parentCategoryId },
              select: { id: true },
            })
          : Promise.resolve(null),
        childCategoryId
          ? this.prisma.category.findUnique({
              where: { id: childCategoryId },
              select: { id: true },
            })
          : Promise.resolve(null),
        storeId
          ? this.prisma.store.findUnique({
              where: { id: storeId },
              select: { id: true, userId: true },
            })
          : Promise.resolve(null),
      ]);

    if (parentCategoryId && !parentCategoryExists) {
      throw new NotFoundException(
        `Parent category with ID ${parentCategoryId} not found.`,
      );
    }

    if (childCategoryId && !childCategoryExists) {
      throw new NotFoundException(
        `Child category with ID ${childCategoryId} not found.`,
      );
    }

    if (storeId !== undefined) {
      if (storeId !== null) {
        if (!storeToUse) {
          throw new NotFoundException(`Store with ID ${storeId} not found.`);
        }
        if (storeToUse.userId !== user.id) {
          throw new ForbiddenException(
            'You are not the owner of this store. Only the store owner can assign products to this store.',
          );
        }
      }
    }

    const updateData: any = {
      ...otherData,
      ...(categoryId && { category: { connect: { id: categoryId } } }),
      ...(parentCategoryId !== undefined && {
        parentCategory: parentCategoryId
          ? { connect: { id: parentCategoryId } }
          : { disconnect: true },
      }),
      ...(childCategoryId !== undefined && {
        childCategory: childCategoryId
          ? { connect: { id: childCategoryId } }
          : { disconnect: true },
      }),
      ...(storeId !== undefined && {
        store: storeId ? { connect: { id: storeId } } : { disconnect: true },
      }),
      ...(isActive !== undefined && {
        isActive: isActive,
      }),
    };

    return this.prisma.product.update({
      where: { id },
      data: updateData,
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
