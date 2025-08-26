import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ShippingRatesService } from './shipping-rates.service';
import { CheckRatesDto } from './dto/check-rates.dto';
import { CheckRatesByCoordsDto } from './dto/check-rates-by-coords.dto';

@Controller('shipping-rates')
export class ShippingRatesController {
  constructor(private readonly shippingRatesService: ShippingRatesService) {}

  @Post('check-by-area')
  checkRatesByArea(@Body(new ValidationPipe()) checkRatesDto: CheckRatesDto) {
    return this.shippingRatesService.checkRatesByArea(checkRatesDto);
  }

  @Post('check-by-coords')
  checkRatesByCoords(
    @Body(new ValidationPipe()) checkRatesByCoordsDto: CheckRatesByCoordsDto,
  ) {
    return this.shippingRatesService.checkRatesByCoords(checkRatesByCoordsDto);
  }
}
