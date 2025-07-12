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

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.role !== UserRole.USER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only users with USER or ADMIN role can create a store.',
      );
    }

    const existingStore = await this.prisma.store.findUnique({
      where: { userId },
    });
    if (existingStore) {
      throw new ConflictException('User already owns a store.');
    }

    const storeWithSameSlug = await this.prisma.store.findUnique({
      where: { slug: storeData.slug },
    });
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

    const userToOwnStore = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userToOwnStore) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const existingStore = await this.prisma.store.findUnique({
      where: { userId },
    });
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
        include: {
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
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
      include: {
        profile: true,
        location: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        products: {
          where: { isPublished: true, isActive: true },
          include: {
            variants: {
              where: { isActive: true },
              orderBy: { price: 'asc' },
            },
          },
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
      include: { profile: true, location: true },
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
    const myStore = await this.findMyStore(userId);
    if (!myStore.profile) {
      throw new NotFoundException('Store profile does not exist.');
    }

    return this.prisma.storeProfile.update({
      where: { id: myStore.profile.id },
      data: updateStoreProfileDto,
    });
  }
}
