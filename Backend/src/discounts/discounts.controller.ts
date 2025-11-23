import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { QueryDiscountDto } from './dto/query-discount.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query(new ValidationPipe({ transform: true })) queryDto: QueryDiscountDto) {
    return this.discountsService.findAll(queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.discountsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createDiscountDto: CreateDiscountDto,
  ) {
    return this.discountsService.create(user, createDiscountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountsService.update(user, id, updateDiscountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.discountsService.remove(user, id);
  }
}
