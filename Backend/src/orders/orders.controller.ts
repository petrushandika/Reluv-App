import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user.id, createOrderDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllForUser(@GetUser() user: User) {
    return this.ordersService.findAllForUser(user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOneForUser(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOneForUser(id, user.id);
  }

  @Get('seller/all')
  @HttpCode(HttpStatus.OK)
  findAllForSeller(@GetUser() user: User) {
    return this.ordersService.findAllForSeller(user.id);
  }

  @Get('seller/:id')
  @HttpCode(HttpStatus.OK)
  findOneForSeller(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.findOneForSeller(id, user.id);
  }

  @Post('seller/:id/status')
  @HttpCode(HttpStatus.OK)
  updateOrderStatus(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe())
    updateOrderDto: import('./dto/update-order.dto').UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderStatus(id, user.id, updateOrderDto);
  }
}
