import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
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
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, PrismaService],
})
export class GoogleModule {}
