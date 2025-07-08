import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createLocationDto: CreateLocationDto) {
    if (createLocationDto.isDefault) {
      await this.prisma.location.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.location.create({
      data: {
        ...createLocationDto,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAllForUser(userId: number) {
    return this.prisma.location.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const location = await this.prisma.location.findFirst({
      where: { id, userId },
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(
    id: number,
    userId: number,
    updateLocationDto: UpdateLocationDto,
  ) {
    await this.findOne(id, userId);

    if (updateLocationDto.isDefault === true) {
      await this.prisma.$transaction([
        this.prisma.location.updateMany({
          where: { userId, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        }),
        this.prisma.location.update({
          where: { id },
          data: updateLocationDto,
        }),
      ]);
      return this.findOne(id, userId);
    }

    return this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    await this.prisma.location.delete({
      where: { id },
    });
    return { message: `Location with ID ${id} successfully deleted.` };
  }
}
