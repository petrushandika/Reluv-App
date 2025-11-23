import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { VouchersModule } from 'src/vouchers/vouchers.module';
import { DiscountsModule } from 'src/discounts/discounts.module';

@Module({
  imports: [PaymentsModule, VouchersModule, DiscountsModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
