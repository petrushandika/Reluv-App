import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
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
  createOrder(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user.id, createOrderDto);
  }

  @Get()
  findAllForUser(@GetUser() user: User) {
    return this.ordersService.findAllForUser(user.id);
  }

  @Get(':id')
  findOneForUser(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOneForUser(id, user.id);
  }
}
