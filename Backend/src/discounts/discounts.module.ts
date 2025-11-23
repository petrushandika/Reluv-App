import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DiscountsController],
  providers: [DiscountsService, PrismaService],
  exports: [DiscountsService],
})
export class DiscountsModule {}
