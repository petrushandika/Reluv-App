import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, Order, OrderItem, Variant, Product } from '@prisma/client';

type OrderWithDetails = Order & {
  items: (OrderItem & {
    variant: Variant & {
      product: Product;
    };
  })[];
};

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmation(user: User, token: string) {
    let backendUrl =
      this.configService.get<string>('BACKEND_URL') ||
      'https://be-reluv-app.vercel.app';
    backendUrl = backendUrl.replace(/\/$/, '');
    const url = `${backendUrl}/api/v1/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome! Please Confirm Your Email',
      template: './verification',
      context: {
        name: user.firstName,
        url,
      },
    });
  }

  async sendPasswordReset(user: User, token: string) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'https://fe-reluv-app.vercel.app';
    const url = `${frontendUrl}/auth/reset?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Your Password Reset Request',
      template: './forgot',
      context: {
        name: user.firstName,
        url,
      },
    });
  }

  async sendOrderStatusUpdate(user: User, order: OrderWithDetails) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'https://fe-reluv-app.vercel.app';
    const orderUrl = `${frontendUrl}/orders/${order.id}`;

    const formattedItems = order.items.map((item) => ({
      productName: item.variant.product.name,
      quantity: item.quantity,
      price: item.price.toLocaleString('id-ID'),
      total: item.total.toLocaleString('id-ID'),
    }));

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Update for your order #${order.orderNumber}`,
      template: './order',
      context: {
        name: user.firstName,
        orderNumber: order.orderNumber,
        status: order.status.replace('_', ' ').toUpperCase(),
        itemsAmount: order.itemsAmount.toLocaleString('id-ID'),
        shippingCost: order.shippingCost.toLocaleString('id-ID'),
        totalAmount: order.totalAmount.toLocaleString('id-ID'),
        items: formattedItems,
        orderUrl,
      },
    });
  }
}
