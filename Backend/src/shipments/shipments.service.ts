import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, ShipmentStatus } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { BiteshipWebhookDto } from './dto/biteship-webhook.dto';

@Injectable()
export class ShipmentsService {
  private readonly BITESHIP_API_KEY: string;
  private readonly BITESHIP_BASE_URL: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const apiKey = this.configService.get<string>('BITESHIP_API_KEY');
    const baseUrl = this.configService.get<string>('BITESHIP_BASE_URL');

    if (!apiKey || !baseUrl) {
      throw new InternalServerErrorException(
        'Biteship API Key or Base URL is not configured in .env file',
      );
    }

    this.BITESHIP_API_KEY = apiKey;
    this.BITESHIP_BASE_URL = baseUrl;
  }

  async createShipment(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        location: true,
        items: { include: { variant: { include: { product: true } } } },
        buyer: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    const firstProduct = order.items[0]?.variant.product;
    if (!firstProduct)
      throw new NotFoundException('No products found in order');

    const seller = await this.prisma.user.findUnique({
      where: { id: firstProduct.sellerId },
    });

    if (!seller) {
      throw new NotFoundException(
        `Seller for product ID ${firstProduct.id} not found.`,
      );
    }

    const originLocation = await this.prisma.location.findFirst({
      where: { store: { userId: seller.id } },
    });

    if (!originLocation) {
      throw new NotFoundException('Seller origin location not found');
    }

    const biteshipPayload = {
      shipper_contact_name: seller.firstName,
      shipper_contact_phone: seller.phone,
      shipper_address: originLocation.address,
      shipper_postal_code: Number(originLocation.postalCode),
      destination_contact_name: order.location.recipient,
      destination_contact_phone: order.location.phone,
      destination_address: order.location.address,
      destination_postal_code: Number(order.location.postalCode),
      courier_company: 'jne',
      courier_type: 'reg',
      delivery_type: 'now',
      items: order.items.map((item) => ({
        name: item.variant.product.name,
        description: item.variant.size || 'Product Variant',
        value: item.price,
        quantity: item.quantity,
        weight: item.variant.weight,
      })),
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.BITESHIP_BASE_URL}/v1/orders`,
          biteshipPayload,
          { headers: { Authorization: this.BITESHIP_API_KEY } },
        ),
      );

      const biteshipOrder = response.data;

      return this.prisma.shipment.create({
        data: {
          orderId: order.id,
          courier: biteshipOrder.courier.company,
          service: biteshipOrder.courier.type,
          status: 'AWAITING_PICKUP',
          trackingNumber: biteshipOrder.courier_tracking_number,
          biteship_order_id: biteshipOrder.id,
          shippingCost: biteshipOrder.price,
          biteshipResponse: biteshipOrder as unknown as Prisma.JsonObject,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
      }
      throw new InternalServerErrorException(
        'Failed to create shipment order with Biteship.',
      );
    }
  }

  async handleWebhook(payload: BiteshipWebhookDto) {
    const { id, status, courier_tracking_number, history } = payload.data;

    const shipment = await this.prisma.shipment.findFirst({
      where: { biteship_order_id: id },
    });

    if (!shipment) {
      return;
    }

    const newStatus = this.mapBiteshipStatus(status, shipment.status);

    await this.prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        status: newStatus,
        trackingNumber: courier_tracking_number || shipment.trackingNumber,
        trackingHistory: history as any,
      },
    });
  }

  private mapBiteshipStatus(
    biteshipStatus: string,
    currentStatus: ShipmentStatus,
  ): ShipmentStatus {
    switch (biteshipStatus) {
      case 'allocated':
      case 'confirmed':
        return 'AWAITING_PICKUP';
      case 'picking_up':
      case 'picked':
        return 'PICKED_UP';
      case 'on_its_way':
      case 'dropping_off':
        return 'IN_TRANSIT';
      case 'delivered':
        return 'DELIVERED';
      case 'returned':
        return 'RETURNED';
      case 'cancelled':
        return 'CANCELLED';
      default:
        return currentStatus;
    }
  }
}
