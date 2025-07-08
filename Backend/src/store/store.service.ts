import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UpdateStoreProfileDto } from './dto/update-store-profile.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createStoreDto: CreateStoreDto) {
    const { locationId, ...storeData } = createStoreDto;

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
        profile: {
          create: {},
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async findMyStore(userId: number) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      include: {
        profile: true,
        location: true,
      },
    });
    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }
    return store;
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
      },
    });
    if (!store) {
      throw new NotFoundException(`Store with slug "${slug}" not found.`);
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

  /**
   * Memperbarui profil toko milik pengguna.
   */
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
