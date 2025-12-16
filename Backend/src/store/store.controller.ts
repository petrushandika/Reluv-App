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
  ParseIntPipe,
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

  // Store Dashboard Endpoints

  @UseGuards(JwtAuthGuard)
  @Get('analytics')
  @HttpCode(HttpStatus.OK)
  getAnalytics(@GetUser() user: User) {
    return this.storeService.getAnalytics(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('products')
  @HttpCode(HttpStatus.OK)
  getStoreProducts(
    @GetUser() user: User,
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    return this.storeService.getStoreProducts(user.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  @HttpCode(HttpStatus.OK)
  getStoreOrders(
    @GetUser() user: User,
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    return this.storeService.getStoreOrders(user.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reviews')
  @HttpCode(HttpStatus.OK)
  getStoreReviews(
    @GetUser() user: User,
    @Query(new ValidationPipe({ transform: true })) query: any,
  ) {
    return this.storeService.getStoreReviews(user.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('vouchers')
  @HttpCode(HttpStatus.OK)
  getStoreVouchers(@GetUser() user: User) {
    return this.storeService.getStoreVouchers(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('discounts')
  @HttpCode(HttpStatus.OK)
  getStoreDiscounts(@GetUser() user: User) {
    return this.storeService.getStoreDiscounts(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('promotions')
  @HttpCode(HttpStatus.OK)
  getStorePromotions(@GetUser() user: User) {
    return this.storeService.getStorePromotions(user.id);
  }

  // Product Management Endpoints for Store Dashboard

  @UseGuards(JwtAuthGuard)
  @Get('products/:id')
  @HttpCode(HttpStatus.OK)
  getStoreProduct(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.storeService.getStoreProduct(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('products/:id/toggle')
  @HttpCode(HttpStatus.OK)
  toggleProductStatus(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.storeService.toggleProductStatus(user.id, id);
  }

  // Order Detail Endpoint

  @UseGuards(JwtAuthGuard)
  @Get('orders/:id')
  @HttpCode(HttpStatus.OK)
  getStoreOrder(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.storeService.getStoreOrder(user.id, id);
  }

  // Review Reply Endpoint

  @UseGuards(JwtAuthGuard)
  @Post('reviews/:id/reply')
  @HttpCode(HttpStatus.OK)
  replyToReview(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body('reply') reply: string,
  ) {
    return this.storeService.replyToReview(user.id, id, reply);
  }
}
