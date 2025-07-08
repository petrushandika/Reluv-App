import { Module } from '@nestjs/common';
import { ShippingRatesService } from './shipping-rates.service';
import { ShippingRatesController } from './shipping-rates.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ShippingRatesController],
  providers: [ShippingRatesService],
})
export class ShippingRatesModule {}
