import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { FacebookController } from './facebook.controller';
import { FacebookService } from './facebook.service';
import { FacebookStrategy } from './facebook.strategy';
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
  controllers: [FacebookController],
  providers: [FacebookService, FacebookStrategy, PrismaService],
})
export class FacebookModule {}
