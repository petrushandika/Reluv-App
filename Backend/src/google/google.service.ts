import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleDto } from './dto/google.dto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class GoogleService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: GoogleDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { googleId: payload.googleId },
      include: { profile: true },
    });
    if (user) {
      if (payload.avatar && user.profile) {
        await this.prisma.userProfile.update({
          where: { userId: user.id },
          data: { avatar: payload.avatar },
        });
      } else if (payload.avatar && !user.profile) {
        await this.prisma.userProfile.create({
          data: {
            userId: user.id,
            avatar: payload.avatar,
          },
        });
      }
      const updatedUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { profile: true },
      });
      if (!updatedUser) {
        throw new Error('User not found after update');
      }
      return updatedUser;
    }

    const userByEmail = await this.prisma.user.findUnique({
      where: { email: payload.email },
      include: { profile: true },
    });
    if (userByEmail) {
      const updatedUser = await this.prisma.user.update({
        where: { email: payload.email },
        data: { googleId: payload.googleId },
        include: { profile: true },
      });
      if (payload.avatar) {
        if (updatedUser.profile) {
          await this.prisma.userProfile.update({
            where: { userId: updatedUser.id },
            data: { avatar: payload.avatar },
          });
        } else {
          await this.prisma.userProfile.create({
            data: {
              userId: updatedUser.id,
              avatar: payload.avatar,
            },
          });
        }
      }
      const finalUser = await this.prisma.user.findUnique({
        where: { id: updatedUser.id },
        include: { profile: true },
      });
      if (!finalUser) {
        throw new Error('User not found after update');
      }
      return finalUser;
    }

    const dataToCreate: Prisma.UserCreateInput = {
      email: payload.email,
      googleId: payload.googleId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      isVerified: true,
      password: null,
      profile: payload.avatar
        ? {
            create: {
              avatar: payload.avatar,
            },
          }
        : undefined,
    };

    const newUser = await this.prisma.user.create({
      data: dataToCreate,
      include: { profile: true },
    });
    return newUser;
  }

  login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
