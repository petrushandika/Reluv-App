import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { FacebookDto } from './dto/facebook.dto';

@Injectable()
export class FacebookService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: FacebookDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { facebookId: payload.facebookId },
    });
    if (user) {
      return user;
    }

    // If email exists, link the account
    if (payload.email) {
      const userByEmail = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (userByEmail) {
        return this.prisma.user.update({
          where: { email: payload.email },
          data: { facebookId: payload.facebookId },
        });
      }
    }

    // If email is not provided by Facebook, we cannot create an account
    if (!payload.email) {
      throw new UnauthorizedException(
        'Email not provided by Facebook. Cannot create an account.',
      );
    }

    const dataToCreate: Prisma.UserCreateInput = {
      email: payload.email,
      facebookId: payload.facebookId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      isVerified: true,
      password: null,
    };

    const newUser = await this.prisma.user.create({ data: dataToCreate });
    return newUser;
  }

  login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
