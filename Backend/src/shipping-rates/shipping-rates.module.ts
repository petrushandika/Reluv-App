import { Module } from '@nestjs/common';
import { ShippingRatesService } from './shipping-rates.service';
import { ShippingRatesController } from './shipping-rates.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ShippingRatesController],
  providers: [ShippingRatesService, PrismaService],
})
export class ShippingRatesModule {}
