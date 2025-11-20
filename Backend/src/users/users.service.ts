import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

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
            banner: true,
            bio: true,
            birth: true,
            gender: true,
          } as any,
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
    files?: {
      avatar?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
  ) {
    const updateData: any = { ...updateUserProfileDto };

    if (files?.avatar && files.avatar.length > 0) {
      const avatarFile = files.avatar[0];

      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!allowedMimeTypes.includes(avatarFile.mimetype)) {
        throw new BadRequestException(
          'Avatar must be an image file (JPEG, PNG, or WebP)',
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (avatarFile.size > maxSize) {
        throw new BadRequestException('Avatar file size must be less than 5MB');
      }

      const avatarResult = await this.cloudinaryService.uploadFile(
        avatarFile,
        'user-profiles/avatars',
      );
      updateData.avatar = avatarResult.secure_url;
    }

    if (files?.banner && files.banner.length > 0) {
      const bannerFile = files.banner[0];

      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!allowedMimeTypes.includes(bannerFile.mimetype)) {
        throw new BadRequestException(
          'Banner must be an image file (JPEG, PNG, or WebP)',
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (bannerFile.size > maxSize) {
        throw new BadRequestException('Banner file size must be less than 5MB');
      }

      const bannerResult = await this.cloudinaryService.uploadFile(
        bannerFile,
        'user-profiles/banners',
      );
      updateData.banner = bannerResult.secure_url;
    }

    return await this.prisma.userProfile.upsert({
      where: {
        userId: userId,
      },
      update: updateData,
      create: {
        ...updateData,
        userId: userId,
      },
      select: {
        id: true,
        avatar: true,
        banner: true,
        bio: true,
        birth: true,
        gender: true,
      } as any,
    });
  }
}
