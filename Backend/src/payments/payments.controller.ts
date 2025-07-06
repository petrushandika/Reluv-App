import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MidtransNotificationDto } from './dto/midtrans-notification.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('midtrans-notification')
  @HttpCode(200)
  handleMidtransNotification(@Body() notificationDto: MidtransNotificationDto) {
    return this.paymentsService.handleNotification(notificationDto);
  }
}
