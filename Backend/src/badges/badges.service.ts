import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { QueryBadgeDto } from './dto/query-badge.dto';
import { User } from '@prisma/client';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, createBadgeDto: CreateBadgeDto) {
    const { storeId, ...badgeData } = createBadgeDto;

    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, userId: true },
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found.`);
    }

    if (store.userId !== user.id) {
      throw new ForbiddenException(
        'You are not the owner of this store. Only the store owner can create badges for this store.',
      );
    }

    return this.prisma.badge.create({
      data: {
        ...badgeData,
        store: { connect: { id: storeId } },
      },
      include: {
        store: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findAll(queryDto: QueryBadgeDto) {
    const { page = 1, limit = 10, type, storeId } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (type) where.type = type;
    if (storeId) where.storeId = storeId;

    const [badges, total] = await this.prisma.$transaction([
      this.prisma.badge.findMany({
        where,
        skip,
        take: limit,
        include: {
          store: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.badge.count({ where }),
    ]);

    return {
      data: badges,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const badge = await this.prisma.badge.findUnique({
      where: { id },
      include: {
        store: true,
      },
    });

    if (!badge) {
      throw new NotFoundException(`Badge with ID ${id} not found.`);
    }

    return badge;
  }

  async update(user: User, id: number, updateBadgeDto: UpdateBadgeDto) {
    const badge = await this.prisma.badge.findUnique({
      where: { id },
      include: { store: { select: { userId: true } } },
    });

    if (!badge) {
      throw new NotFoundException(`Badge with ID ${id} not found.`);
    }

    if (badge.store.userId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this badge.',
      );
    }

    return this.prisma.badge.update({
      where: { id },
      data: updateBadgeDto,
      include: {
        store: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async remove(user: User, id: number) {
    const badge = await this.prisma.badge.findUnique({
      where: { id },
      include: { store: { select: { userId: true } } },
    });

    if (!badge) {
      throw new NotFoundException(`Badge with ID ${id} not found.`);
    }

    if (badge.store.userId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this badge.',
      );
    }

    return this.prisma.badge.delete({ where: { id } });
  }
}
