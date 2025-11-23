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
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { QueryPromotionDto } from './dto/query-promotion.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(new ValidationPipe({ transform: true })) queryDto: QueryPromotionDto,
  ) {
    return this.promotionsService.findAll(queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promotionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createPromotionDto: CreatePromotionDto,
  ) {
    return this.promotionsService.create(user, createPromotionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(user, id, updatePromotionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.promotionsService.remove(user, id);
  }
}
