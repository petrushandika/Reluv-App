import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @GetUser('id') ownerId: number,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return this.storesService.create(ownerId, createStoreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('store')
  getMyStore(@GetUser('id') ownerId: number) {
    return this.storesService.findMyStore(ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('store')
  updateMyStore(
    @GetUser('id') ownerId: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storesService.update(ownerId, updateStoreDto);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.storesService.findBySlug(slug);
  }
}
