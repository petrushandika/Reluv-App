import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CheckRatesDto } from './dto/check-rates.dto';
import { CheckRatesFromCartDto } from './dto/check-rates-from-cart.dto';
import { ShippingRatesService } from './shipping-rates.service';

@Controller('shipping-rates')
export class ShippingRatesController {
  constructor(private readonly shippingRatesService: ShippingRatesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('check-from-cart')
  checkRatesFromCart(
    @GetUser() user: User,
    @Body(new ValidationPipe()) checkRatesDto: CheckRatesFromCartDto,
  ) {
    return this.shippingRatesService.checkRatesFromCart(user.id, checkRatesDto);
  }

  @Post('check')
  checkRates(@Body(new ValidationPipe()) checkRatesDto: CheckRatesDto) {
    return this.shippingRatesService.checkRates(checkRatesDto);
  }
}
