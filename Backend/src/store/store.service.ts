import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UpdateStoreProfileDto } from './dto/update-store-profile.dto';
import { AdminCreateStoreDto } from './dto/admin-create-store.dto';
import { Prisma, UserRole } from '@prisma/client';
import { QueryStoreDto } from './dto/query-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createStoreDto: CreateStoreDto) {
    const { locationId, ...storeData } = createStoreDto;

    const [user, existingStore, storeWithSameSlug] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
      }),
      this.prisma.store.findUnique({
        where: { userId },
        select: { id: true },
      }),
      this.prisma.store.findUnique({
        where: { slug: storeData.slug },
        select: { id: true },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.role !== UserRole.USER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only users with USER or ADMIN role can create a store.',
      );
    }

    if (existingStore) {
      throw new ConflictException('User already owns a store.');
    }

    if (storeWithSameSlug) {
      throw new ConflictException('Store slug is already taken.');
    }

    return this.prisma.store.create({
      data: {
        ...storeData,
        user: { connect: { id: userId } },
        location: locationId ? { connect: { id: locationId } } : undefined,
        profile: { create: {} },
      },
    });
  }

  async createStoreForUser(adminCreateStoreDto: AdminCreateStoreDto) {
    const { userId, locationId, ...storeData } = adminCreateStoreDto;

    const [userToOwnStore, existingStore] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      }),
      this.prisma.store.findUnique({
        where: { userId },
        select: { id: true },
      }),
    ]);

    if (!userToOwnStore) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (existingStore) {
      throw new ConflictException(
        `User with ID ${userId} already owns a store.`,
      );
    }

    return this.prisma.store.create({
      data: {
        ...storeData,
        user: { connect: { id: userId } },
        location: locationId ? { connect: { id: locationId } } : undefined,
        profile: { create: {} },
      },
    });
  }

  async findAllPublic(queryDto: QueryStoreDto) {
    const { page = 1, limit = 12, search } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.StoreWhereInput = {
      isActive: true,
      isVerified: true,
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [stores, total] = await this.prisma.$transaction([
      this.prisma.store.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          totalProducts: true,
          totalSales: true,
          rating: true,
          createdAt: true,
          profile: {
            select: { avatar: true, banner: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.store.count({ where }),
    ]);

    return {
      data: stores,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        isVerified: true,
        totalProducts: true,
        totalSales: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            avatar: true,
            banner: true,
            bio: true,
            operational: true,
          },
        },
        location: {
          select: {
            id: true,
            city: true,
            province: true,
            district: true,
            subDistrict: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        products: {
          where: { isPublished: true, isActive: true },
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
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!store) {
      throw new NotFoundException(`Store with slug "${slug}" not found.`);
    }
    return store;
  }

  async findMyStore(userId: number) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        isVerified: true,
        totalProducts: true,
        totalSales: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            avatar: true,
            banner: true,
            bio: true,
            operational: true,
          },
        },
        location: {
          select: {
            id: true,
            label: true,
            city: true,
            province: true,
            district: true,
            subDistrict: true,
            postalCode: true,
            address: true,
          },
        },
      },
    });
    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }
    return store;
  }

  async updateMyStore(userId: number, updateStoreDto: UpdateStoreDto) {
    const myStore = await this.findMyStore(userId);
    const { locationId, ...storeData } = updateStoreDto;

    return this.prisma.store.update({
      where: { id: myStore.id },
      data: {
        ...storeData,
        location: locationId ? { connect: { id: locationId } } : undefined,
      },
    });
  }

  async updateMyStoreProfile(
    userId: number,
    updateStoreProfileDto: UpdateStoreProfileDto,
  ) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store to update.');
    }

    return this.prisma.storeProfile.update({
      where: { storeId: store.id },
      data: updateStoreProfileDto,
      select: {
        id: true,
        avatar: true,
        banner: true,
        bio: true,
        operational: true,
      },
    });
  }
}
