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
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { QueryBadgeDto } from './dto/query-badge.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(new ValidationPipe({ transform: true })) queryDto: QueryBadgeDto,
  ) {
    return this.badgesService.findAll(queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createBadgeDto: CreateBadgeDto,
  ) {
    return this.badgesService.create(user, createBadgeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateBadgeDto: UpdateBadgeDto,
  ) {
    return this.badgesService.update(user, id, updateBadgeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.badgesService.remove(user, id);
  }
}
