import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        googleId: true,
        facebookId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            avatar: true,
            bio: true,
            birth: true,
            gender: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateMe(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        googleId: true,
        facebookId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async updateMyProfile(
    userId: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return await this.prisma.userProfile.upsert({
      where: {
        userId: userId,
      },
      update: updateUserProfileDto,
      create: {
        ...updateUserProfileDto,
        userId: userId,
      },
      select: {
        id: true,
        avatar: true,
        bio: true,
        birth: true,
        gender: true,
      },
    });
  }
}
