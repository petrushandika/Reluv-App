import { Injectable } from '@nestjs/common';
import { CreateShippingRateDto } from './dto/create-shipping-rate.dto';
import { UpdateShippingRateDto } from './dto/update-shipping-rate.dto';

@Injectable()
export class ShippingRatesService {
  create(createShippingRateDto: CreateShippingRateDto) {
    return 'This action adds a new shippingRate';
  }

  findAll() {
    return `This action returns all shippingRates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shippingRate`;
  }

  update(id: number, updateShippingRateDto: UpdateShippingRateDto) {
    return `This action updates a #${id} shippingRate`;
  }

  remove(id: number) {
    return `This action removes a #${id} shippingRate`;
  }
}
