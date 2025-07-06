import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order, PaymentStatus, Prisma } from '@prisma/client';
import { createHash } from 'crypto';
import * as midtransClient from 'midtrans-client';
import { PrismaService } from '../prisma/prisma.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { MidtransNotificationDto } from './dto/midtrans-notification.dto';
import { MidtransTransaction } from './dto/midtrans-transaction.dto';

@Injectable()
export class PaymentsService {
  private snap: midtransClient.Snap;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private shipmentsService: ShipmentsService,
  ) {
    const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');
    const clientKey = this.configService.get<string>('MIDTRANS_CLIENT_KEY');

    if (!serverKey || !clientKey) {
      throw new InternalServerErrorException(
        'Midtrans server key or client key is not configured.',
      );
    }

    this.snap = new midtransClient.Snap({
      isProduction:
        this.configService.get<string>('MIDTRANS_IS_PRODUCTION') === 'true',
      serverKey: serverKey,
      clientKey: clientKey,
    });
  }

  async createPayment(order: Order): Promise<MidtransTransaction> {
    const buyer = await this.prisma.user.findUnique({
      where: { id: order.buyerId },
    });

    if (!buyer) {
      throw new NotFoundException(`Buyer for order ID ${order.id} not found.`);
    }

    const parameter = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: order.totalAmount,
      },
      customer_details: {
        first_name: buyer.firstName,
        last_name: buyer.lastName,
        email: buyer.email,
        phone: buyer.phone,
      },
    };

    try {
      const transaction = (await this.snap.createTransaction(
        parameter,
      )) as MidtransTransaction;

      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.totalAmount,
          status: PaymentStatus.PENDING,
          snap_token: transaction.token,
          snap_redirect_url: transaction.redirect_url,
          midtrans_order_id: order.orderNumber,
        },
      });

      return transaction;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Midtrans API Error:', error.message);
        throw new InternalServerErrorException(
          `Failed to create payment transaction: ${error.message}`,
        );
      }
      throw new InternalServerErrorException(
        'An unknown error occurred while creating payment transaction.',
      );
    }
  }

  async handleNotification(notification: MidtransNotificationDto) {
    const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');
    const hash = createHash('sha512')
      .update(
        `${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`,
      )
      .digest('hex');

    if (hash !== notification.signature_key) {
      console.warn('Invalid Midtrans notification signature received.');
      return;
    }

    const payment = await this.prisma.payment.findUnique({
      where: { midtrans_order_id: notification.order_id },
      include: { order: true },
    });

    if (!payment) {
      console.warn(`Payment with order_id ${notification.order_id} not found.`);
      return;
    }

    let paymentStatus: PaymentStatus;
    let orderStatus = payment.order.status;

    switch (notification.transaction_status) {
      case 'settlement':
      case 'capture':
        paymentStatus = PaymentStatus.PAID;
        orderStatus = 'PAID';
        break;
      case 'pending':
        paymentStatus = PaymentStatus.PENDING;
        break;
      case 'expire':
        paymentStatus = PaymentStatus.EXPIRED;
        orderStatus = 'CANCELLED';
        break;
      case 'cancel':
      case 'deny':
        paymentStatus = PaymentStatus.FAILED;
        orderStatus = 'CANCELLED';
        break;
      default:
        return;
    }

    if (payment.status !== paymentStatus) {
      const [, updatedOrder] = await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: paymentStatus,
            midtrans_tx_id: notification.transaction_id,
            midtrans_payment_type: notification.payment_type,
            gatewayResponse: notification as unknown as Prisma.JsonObject,
          },
        }),
        this.prisma.order.update({
          where: { id: payment.orderId },
          data: { status: orderStatus },
        }),
      ]);

      if (updatedOrder.status === 'PAID') {
        try {
          await this.shipmentsService.createShipment(updatedOrder.id);
        } catch (error) {
          console.error(
            `Failed to create shipment for paid order ${updatedOrder.id}:`,
            error,
          );
        }
      }
    }
  }
}
