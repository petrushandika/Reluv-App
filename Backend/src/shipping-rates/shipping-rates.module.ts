import { Module } from '@nestjs/common';
import { ShippingRatesService } from './shipping-rates.service';
import { ShippingRatesController } from './shipping-rates.controller';

@Module({
  controllers: [ShippingRatesController],
  providers: [ShippingRatesService],
})
export class ShippingRatesModule {}
