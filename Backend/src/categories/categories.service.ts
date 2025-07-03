import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { slug } = createCategoryDto;

    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (existingCategory) {
      throw new ConflictException(
        `Category with slug '${slug}' already exists`,
      );
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        parentCategory: true,
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

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
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
