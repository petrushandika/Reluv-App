import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CartService } from 'src/cart/cart.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UsersService, CartService],
})
export class AuthModule {}
