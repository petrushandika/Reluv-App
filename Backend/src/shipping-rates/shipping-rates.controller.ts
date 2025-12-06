import { 
  Controller, 
  Post, 
  Body, 
  ValidationPipe, 
  HttpCode, 
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ShippingRatesService } from './shipping-rates.service';
import { CheckRatesDto } from './dto/check-rates.dto';
import { CheckRatesByCoordsDto } from './dto/check-rates-by-coords.dto';

@Controller('shipping-rates')
export class ShippingRatesController {
  constructor(private readonly shippingRatesService: ShippingRatesService) {}

  @Post('check-by-area')
  @HttpCode(HttpStatus.OK)
  async checkRatesByArea(@Body(new ValidationPipe()) checkRatesDto: CheckRatesDto) {
    try {
      return await this.shippingRatesService.checkRatesByArea(checkRatesDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to check shipping rates. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('check-by-coords')
  @HttpCode(HttpStatus.OK)
  async checkRatesByCoords(
    @Body(new ValidationPipe()) checkRatesByCoordsDto: CheckRatesByCoordsDto,
  ) {
    try {
      return await this.shippingRatesService.checkRatesByCoords(checkRatesByCoordsDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to check shipping rates. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
