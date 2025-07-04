import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ShippingRatesService } from './shipping-rates.service';
import { GetShippingRatesDto } from './dto/get-shipping-rates.dto';
import { UpsertShippingRateDto } from './dto/upsert-shipping-rate.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
// import { AdminGuard } from '../common/gurads/admin.guard';

@Controller('shipping-rates')
export class ShippingRatesController {
  constructor(private readonly shippingRatesService: ShippingRatesService) {}

  @Get()
  findAvailableRates(
    @Query(new ValidationPipe({ transform: true })) query: GetShippingRatesDto,
  ) {
    return this.shippingRatesService.findAvailableRates(query);
  }

  @Post('upsert')
  @UseGuards(JwtAuthGuard)
  upsertRate(@Body(new ValidationPipe()) dto: UpsertShippingRateDto) {
    return this.shippingRatesService.upsertRate(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeRate(@Param('id', ParseIntPipe) id: number) {
    return this.shippingRatesService.removeRate(id);
  }
}
