import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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
    });

    if (!profile) {
      throw new NotFoundException('Profile not found for the current user.');
    }

    return profile;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profile not found. Cannot update.');
    }

    return this.prisma.profile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }
}
