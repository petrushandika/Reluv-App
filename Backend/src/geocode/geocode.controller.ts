import {
  Controller,
  Get,
  Query,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GeocodeService } from './geocode.service';
import { ReverseGeocodeQueryDto } from './dto/create-geocode.dto';

@Controller('geocode')
export class GeocodeController {
  constructor(private readonly geocodeService: GeocodeService) {}

  @Get('reverse')
  @HttpCode(HttpStatus.OK)
  reverseGeocode(
    @Query(new ValidationPipe({ transform: true }))
    query: ReverseGeocodeQueryDto,
  ) {
    return this.geocodeService.reverseGeocode(query.lat, query.lon);
  }
}
