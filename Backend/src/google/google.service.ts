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
    });
    if (user) {
      return user;
    }

    const userByEmail = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (userByEmail) {
      return this.prisma.user.update({
        where: { email: payload.email },
        data: { googleId: payload.googleId },
      });
    }

    const dataToCreate: Prisma.UserCreateInput = {
      email: payload.email,
      googleId: payload.googleId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      isVerified: true,
      password: null,
    };

    const newUser = await this.prisma.user.create({
      data: dataToCreate,
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
