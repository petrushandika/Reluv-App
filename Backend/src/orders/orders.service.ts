import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '@prisma/client';
import { PaymentsService } from '../payments/payments.service';
import { VouchersService } from '../vouchers/vouchers.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService,
    private vouchersService: VouchersService,
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    const { locationId, shippingCost, notes, voucherCode } = createOrderDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { variant: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    let itemsAmount = 0;
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for variant ID ${item.variant.id}.`,
        );
      }
      itemsAmount += item.variant.price * item.quantity;
    }

    let discountAmount = 0;
    let finalVoucherCode: string | null = null;
    let voucherId: number | null = null;

    if (voucherCode) {
      const user = { id: userId } as User;
      const result = await this.vouchersService.validateAndCalculateDiscount(
        user,
        voucherCode,
        itemsAmount,
      );
      discountAmount = result.discountAmount;
      voucherId = result.voucherId;
      finalVoucherCode = voucherCode;
    }

    const totalAmount = itemsAmount + shippingCost - discountAmount;
    if (totalAmount < 0) {
      throw new BadRequestException('Total amount cannot be negative.');
    }
    const orderNumber = `ORD-${Date.now()}-${userId}`;

    const createdOrder = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          buyerId: userId,
          locationId,
          itemsAmount,
          shippingCost,
          discountAmount,
          voucherCode: finalVoucherCode,
          totalAmount,
          notes,
        },
      });

      const orderItemsData = cart.items.map((item) => ({
        orderId: order.id,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.variant.price,
        total: item.variant.price * item.quantity,
      }));
      await tx.orderItem.createMany({ data: orderItemsData });

      for (const item of cart.items) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (voucherId) {
        await tx.voucherUsage.create({
          data: { userId: userId, voucherId: voucherId },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });

    const paymentTransaction =
      await this.paymentsService.createPayment(createdOrder);

    return { order: createdOrder, payment: paymentTransaction };
  }

  async findAllForUser(userId: number) {
    return this.prisma.order.findMany({
      where: { buyerId: userId },
      include: {
        items: {
          include: {
            variant: {
              select: {
                size: true,
                color: true,
                product: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(id: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, buyerId: userId },
      include: {
        items: { include: { variant: true } },
        payment: true,
        shipment: true,
        location: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }
}
