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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Body(new ValidationPipe()) createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.id, productId, createReviewDto);
  }

  @Get()
  findAllForProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewsService.findAllForProduct(productId);
  }
}
