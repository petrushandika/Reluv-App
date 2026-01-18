import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController, ReviewsManagementController } from './reviews.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ReviewsController, ReviewsManagementController],
  providers: [ReviewsService, PrismaService],
})
export class ReviewsModule {}
