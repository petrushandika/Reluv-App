import { Body, Controller, HttpCode, Post, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MidtransNotificationDto } from './dto/midtrans-notification.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('midtrans-notification')
  @HttpCode(200)
  handleMidtransNotification(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
      }),
    )
    notificationDto: MidtransNotificationDto,
  ) {
    return this.paymentsService.handleNotification(notificationDto);
  }
}
