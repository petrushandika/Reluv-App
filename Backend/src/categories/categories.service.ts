import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { parentId, name, slug } = createCategoryDto;

    if (!slug) {
      throw new BadRequestException('Slug is a required field.');
    }

    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: slug },
    });
    if (existingCategory) {
      throw new ConflictException(
        `Category with slug '${slug}' already exists`,
      );
    }

    const dataToCreate: Prisma.CategoryCreateInput = {
      name: name,
      slug: slug,
      ...(parentId && {
        parentCategory: {
          connect: { id: parentId },
        },
      }),
    };

    return this.prisma.category.create({
      data: dataToCreate,
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        childCategories: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parentCategory: true,
        childCategories: true,
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    if (updateCategoryDto.slug) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(
          `Slug '${updateCategoryDto.slug}' is already in use`,
        );
      }
    }

    const { parentId, name, slug } = updateCategoryDto;

    const dataToUpdate: Prisma.CategoryUpdateInput = {};

    if (name) {
      dataToUpdate.name = name;
    }
    if (slug) {
      dataToUpdate.slug = slug;
    }
    if (parentId) {
      dataToUpdate.parentCategory = {
        connect: { id: parentId },
      };
    }

    return this.prisma.category.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    if (category.childCategories.length > 0) {
      throw new ConflictException(
        `Cannot delete category with ID ${id} because it has child categories.`,
      );
    }

    if (category.products.length > 0) {
      throw new ConflictException(
        `Cannot delete category with ID ${id} because it has associated products.`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: `Category with ID ${id} has been successfully deleted.` };
  }
}
