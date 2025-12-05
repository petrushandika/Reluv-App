import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ValidationPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { UpdateStoreProfileDto } from './dto/update-store-profile.dto';
import { QueryStoreDto } from './dto/query-store.dto';
import { AdminCreateStoreDto } from './dto/admin-create-store.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllPublic(
    @Query(new ValidationPipe({ transform: true })) queryDto: QueryStoreDto,
  ) {
    return this.storeService.findAllPublic(queryDto);
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  findBySlug(@Param('slug') slug: string) {
    return this.storeService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createStoreDto: CreateStoreDto,
  ) {
    return this.storeService.create(user.id, createStoreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/my-store')
  @HttpCode(HttpStatus.OK)
  findMyStore(@GetUser() user: User) {
    return this.storeService.findMyStore(user.id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/admin/create-for-user')
  @HttpCode(HttpStatus.CREATED)
  createStoreForUser(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
      }),
    )
    adminCreateStoreDto: AdminCreateStoreDto,
  ) {
    return this.storeService.createStoreForUser(adminCreateStoreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/my-store')
  @HttpCode(HttpStatus.OK)
  updateMyStore(
    @GetUser() user: User,
    @Body(new ValidationPipe()) updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.updateMyStore(user.id, updateStoreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/my-store/profile')
  @HttpCode(HttpStatus.OK)
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
