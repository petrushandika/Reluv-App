import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { MapsService } from './maps.service';
import { SearchAreaDto, SearchMapDto } from './dto/search-area.dto';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get('search-areas')
  searchAreas(@Query(new ValidationPipe()) query: SearchAreaDto) {
    return this.mapsService.searchAreas(query.input);
  }

  @Get('search-osm')
  searchOpenStreetMap(@Query(new ValidationPipe()) query: SearchMapDto) {
    return this.mapsService.searchOpenStreetMap(query.q);
  }
}
