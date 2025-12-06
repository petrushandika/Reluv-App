import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expirationTime = configService.get<string>('JWT_EXPIRATION_TIME');
        const signOptions: SignOptions = {
          expiresIn: expirationTime as StringValue,
        };
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions,
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, RateLimitGuard],
  exports: [AuthService],
})
export class AuthModule {}
