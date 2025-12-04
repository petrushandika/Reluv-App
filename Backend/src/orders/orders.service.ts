import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '@prisma/client';
import { PaymentsService } from '../payments/payments.service';
import { VouchersService } from '../vouchers/vouchers.service';
import { DiscountsService } from '../discounts/discounts.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService,
    private vouchersService: VouchersService,
    private discountsService: DiscountsService,
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    const { locationId, shippingCost, notes, voucherCode } = createOrderDto;

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      select: {
        id: true,
        items: {
          select: {
            id: true,
            variantId: true,
            quantity: true,
            variant: {
              select: {
                id: true,
                price: true,
                stock: true,
                product: {
                  select: {
                    id: true,
                    sellerId: true,
                    categoryId: true,
                    storeId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    let itemsAmount = 0;
    const itemDiscounts: Array<{
      variantId: number;
      discountAmount: number;
      discountId: number | null;
    }> = [];

    for (const item of cart.items) {
      if (item.variant.product.sellerId === userId) {
        throw new ForbiddenException(
          'You cannot purchase your own products.',
        );
      }
      if (item.variant.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for variant ID ${item.variant.id}.`,
        );
      }
      const itemSubtotal = item.variant.price * item.quantity;
      itemsAmount += itemSubtotal;

      const discountResult = await this.discountsService.applyDiscount(
        item.variant.product.id,
        item.variant.product.categoryId,
        item.variant.product.storeId,
        itemSubtotal,
      );

      itemDiscounts.push({
        variantId: item.variantId,
        discountAmount: discountResult.discountAmount,
        discountId: discountResult.discountId,
      });
    }

    const totalItemDiscounts = itemDiscounts.reduce(
      (sum, item) => sum + item.discountAmount,
      0,
    );

    let discountAmount = totalItemDiscounts;
    let discountId: number | null = null;
    let finalVoucherCode: string | null = null;
    let voucherId: number | null = null;
    let voucherUsageId: number | null = null;

    if (voucherCode) {
      const user = { id: userId } as User;
      const result = await this.vouchersService.validateAndCalculateDiscount(
        user,
        voucherCode,
        itemsAmount - totalItemDiscounts,
      );
      const voucherDiscount = result.discountAmount;
      if (voucherDiscount > 0) {
        discountAmount += voucherDiscount;
        voucherId = result.voucherId;
        finalVoucherCode = voucherCode;
      }
    }

    if (totalItemDiscounts > 0) {
      const highestDiscount = itemDiscounts.reduce((max, item) =>
        item.discountAmount > max.discountAmount ? item : max,
      );
      discountId = highestDiscount.discountId;
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
          voucherId: voucherId || undefined,
          discountId: discountId || undefined,
          totalAmount,
          notes,
        },
      });

      const orderItemsData = cart.items.map((item) => {
        const itemDiscount = itemDiscounts.find(
          (d) => d.variantId === item.variantId,
        );
        const itemTotal = item.variant.price * item.quantity;
        return {
          orderId: order.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.variant.price,
          total: itemTotal,
          discountAmount: itemDiscount?.discountAmount || 0,
        };
      });
      await tx.orderItem.createMany({ data: orderItemsData });

      for (const item of cart.items) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (voucherId) {
        const voucherUsage = await tx.voucherUsage.create({
          data: {
            userId: userId,
            voucherId: voucherId,
            orderId: order.id,
          },
        });
        voucherUsageId = voucherUsage.id;

        await tx.order.update({
          where: { id: order.id },
          data: { voucherUsageId: voucherUsageId },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          voucher: true,
          voucherUsage: true,
          discount: true,
        },
      });
    });

    if (!createdOrder) {
      throw new BadRequestException('Failed to create order.');
    }

    const orderForPayment = {
      id: createdOrder.id,
      orderNumber: createdOrder.orderNumber,
      buyerId: createdOrder.buyerId,
      locationId: createdOrder.locationId,
      totalAmount: createdOrder.totalAmount,
      itemsAmount: createdOrder.itemsAmount,
      shippingCost: createdOrder.shippingCost,
      discountAmount: createdOrder.discountAmount,
      voucherCode: createdOrder.voucherCode,
      status: createdOrder.status,
      notes: createdOrder.notes,
      createdAt: createdOrder.createdAt,
      updatedAt: createdOrder.updatedAt,
      voucherId: createdOrder.voucherId,
      voucherUsageId: createdOrder.voucherUsageId,
      discountId: createdOrder.discountId,
    };

    const paymentTransaction =
      await this.paymentsService.createPayment(orderForPayment);

    return { order: createdOrder, payment: paymentTransaction };
  }

  async findAllForUser(userId: number) {
    return this.prisma.order.findMany({
      where: { buyerId: userId },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        itemsAmount: true,
        shippingCost: true,
        discountAmount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            total: true,
            variant: {
              select: {
                id: true,
                size: true,
                color: true,
                image: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: true,
                  },
                },
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
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        itemsAmount: true,
        shippingCost: true,
        discountAmount: true,
        voucherCode: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            total: true,
            discountAmount: true,
            variant: {
              select: {
                id: true,
                size: true,
                color: true,
                sku: true,
                image: true,
                price: true,
                condition: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            method: true,
            amount: true,
            status: true,
            snap_token: true,
            snap_redirect_url: true,
            midtrans_order_id: true,
            paidAt: true,
            expiresAt: true,
            createdAt: true,
          },
        },
        shipment: {
          select: {
            id: true,
            courier: true,
            service: true,
            trackingNumber: true,
            status: true,
            estimatedDays: true,
            shippingCost: true,
            shippedAt: true,
            deliveredAt: true,
            createdAt: true,
          },
        },
        location: {
          select: {
            id: true,
            label: true,
            recipient: true,
            phone: true,
            province: true,
            city: true,
            district: true,
            subDistrict: true,
            postalCode: true,
            address: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }
}
