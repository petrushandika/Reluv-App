import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
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
}
