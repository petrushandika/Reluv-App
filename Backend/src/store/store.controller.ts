import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { UpdateStoreProfileDto } from './dto/update-store-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.storeService.findBySlug(slug);
  }

  @Post()
  create(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createStoreDto: CreateStoreDto,
  ) {
    return this.storeService.create(user.id, createStoreDto);
  }

  @Get('me/my-store')
  findMyStore(@GetUser() user: User) {
    return this.storeService.findMyStore(user.id);
  }

  @Patch('me/my-store')
  updateMyStore(
    @GetUser() user: User,
    @Body(new ValidationPipe()) updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.updateMyStore(user.id, updateStoreDto);
  }

  @Patch('me/my-store/profile')
  updateMyStoreProfile(
    @GetUser() user: User,
    @Body(new ValidationPipe()) updateStoreProfileDto: UpdateStoreProfileDto,
  ) {
    return this.storeService.updateMyStoreProfile(
      user.id,
      updateStoreProfileDto,
    );
  }
}
