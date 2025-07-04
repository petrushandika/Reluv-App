import { Module } from '@nestjs/common';
import { ShippingRatesService } from './shipping-rates.service';
import { ShippingRatesController } from './shipping-rates.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ShippingRatesController],
  providers: [ShippingRatesService, PrismaService],
})
export class ShippingRatesModule {}
