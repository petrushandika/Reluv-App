import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { MapsService } from './maps.service';
import { SearchAreaDto } from './dto/search-area.dto';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('search-areas')
  searchAreas(@Query(new ValidationPipe()) query: SearchAreaDto) {
    return this.mapsService.searchAreas(query.input);
  }
}
