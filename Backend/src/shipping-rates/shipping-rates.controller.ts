import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShippingRatesService } from './shipping-rates.service';
import { CreateShippingRateDto } from './dto/create-shipping-rate.dto';
import { UpdateShippingRateDto } from './dto/update-shipping-rate.dto';

@Controller('shipping-rates')
export class ShippingRatesController {
  constructor(private readonly shippingRatesService: ShippingRatesService) {}

  @Post()
  create(@Body() createShippingRateDto: CreateShippingRateDto) {
    return this.shippingRatesService.create(createShippingRateDto);
  }

  @Get()
  findAll() {
    return this.shippingRatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingRatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShippingRateDto: UpdateShippingRateDto) {
    return this.shippingRatesService.update(+id, updateShippingRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingRatesService.remove(+id);
  }
}
