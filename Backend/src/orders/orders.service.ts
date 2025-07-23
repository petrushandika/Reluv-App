import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService,
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    const { locationId, shippingCost, notes } = createOrderDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for variant ID ${item.variant.id}. Available: ${item.variant.stock}, Requested: ${item.quantity}.`,
        );
      }
    }

    const itemsAmount = cart.items.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0,
    );
    const totalAmount = itemsAmount + shippingCost;
    const orderNumber = `ORD-${Date.now()}-${userId}`;

    const createdOrder = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          buyerId: userId,
          locationId,
          itemsAmount,
          shippingCost,
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
      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      for (const item of cart.items) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

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
