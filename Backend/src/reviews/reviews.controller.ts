import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Body(new ValidationPipe()) createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.id, productId, createReviewDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllForProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewsService.findAllForProduct(productId);
  }

  @Get(':reviewId')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reviewsService.findOne(reviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':reviewId')
  @HttpCode(HttpStatus.OK)
  update(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body(new ValidationPipe()) updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(user.id, reviewId, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':reviewId/reply')
  @HttpCode(HttpStatus.OK)
  reply(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body(new ValidationPipe()) replyReviewDto: ReplyReviewDto,
  ) {
    return this.reviewsService.reply(user.id, reviewId, replyReviewDto);
  }
}
