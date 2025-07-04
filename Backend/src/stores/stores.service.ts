import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createStoreDto: CreateStoreDto) {
    const existingStore = await this.prisma.store.findUnique({
      where: { userId },
    });
    if (existingStore) {
      throw new ConflictException('User already owns a store.');
    }

    const storeWithSameNameOrSlug = await this.prisma.store.findFirst({
      where: {
        OR: [{ name: createStoreDto.name }, { slug: createStoreDto.slug }],
      },
    });
    if (storeWithSameNameOrSlug) {
      throw new ConflictException('Store name or slug is already taken.');
    }

    return this.prisma.store.create({
      data: {
        ...createStoreDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({ where: { slug } });
    if (!store) {
      throw new NotFoundException(`Store with slug "${slug}" not found.`);
    }
    return store;
  }

  async findMyStore(userId: number) {
    const store = await this.prisma.store.findUnique({ where: { userId } });
    if (!store) {
      throw new NotFoundException(`You do not have a store yet.`);
    }
    return store;
  }

  async update(userId: number, updateStoreDto: UpdateStoreDto) {
    const myStore = await this.findMyStore(userId);
    if (updateStoreDto.name || updateStoreDto.slug) {
      const conflictStore = await this.prisma.store.findFirst({
        where: {
          AND: [
            { id: { not: myStore.id } },
            {
              OR: [
                { name: updateStoreDto.name },
                { slug: updateStoreDto.slug },
              ],
            },
          ],
        },
      });
      if (conflictStore) {
        throw new ConflictException('Store name or slug is already taken.');
      }
    }
    return this.prisma.store.update({
      where: { id: myStore.id },
      data: updateStoreDto,
    });
  }
}
