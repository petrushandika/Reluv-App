import {
  Body,
  Controller,
  Post,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { BiteshipWebhookDto } from './dto/biteship-webhook.dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post('biteship-webhook')
  @HttpCode(200)
  handleBiteshipWebhook(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
      }),
    )
    payload: BiteshipWebhookDto,
  ) {
    this.shipmentsService.handleWebhook(payload);
  }
}
