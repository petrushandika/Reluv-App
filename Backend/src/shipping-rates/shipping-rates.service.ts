import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CheckRatesDto } from './dto/check-rates.dto';
import { CheckRatesFromCartDto } from './dto/check-rates-from-cart.dto';

@Injectable()
export class ShippingRatesService {
  private readonly biteshipApiKey: string;
  private readonly biteshipBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('BITESHIP_API_KEY');
    const baseUrl = this.configService.get<string>('BITESHIP_BASE_URL');

    if (!apiKey || !baseUrl) {
      throw new InternalServerErrorException(
        'Biteship configuration is missing.',
      );
    }

    this.biteshipApiKey = apiKey;
    this.biteshipBaseUrl = baseUrl;
  }

  async checkRatesFromCart(
    userId: number,
    checkRatesDto: CheckRatesFromCartDto,
  ) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { include: { store: true } } },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Your cart is empty.');
    }

    const destinationLocation = await this.prisma.location.findUnique({
      where: { id: checkRatesDto.destinationLocationId, userId },
    });
    if (!destinationLocation || !destinationLocation.biteship_area_id) {
      throw new NotFoundException('Destination address not found or invalid.');
    }

    const itemsByStore = new Map<number, { store: any; items: any[] }>();
    for (const item of cart.items) {
      const storeId = item.variant.product.storeId;
      let storeEntry = itemsByStore.get(storeId);
      if (!storeEntry) {
        storeEntry = { store: item.variant.product.store, items: [] };
        itemsByStore.set(storeId, storeEntry);
      }

      const { variant } = item;
      if (
        !variant.weight ||
        !variant.length ||
        !variant.width ||
        !variant.height
      ) {
        throw new BadRequestException(
          `Product variant "${variant.product.name} - ${variant.name || ''}" is missing required dimension data (weight, length, width, height).`,
        );
      }

      storeEntry.items.push({
        name: variant.product.name,
        description: variant.name || 'Product Variant',
        value: variant.price,
        weight: variant.weight,
        length: variant.length,
        width: variant.width,
        height: variant.height,
        quantity: item.quantity,
      });
    }

    const availableCouriers = await this.getAvailableCouriers();

    const shippingOptionsByStore = await Promise.all(
      Array.from(itemsByStore.entries()).map(async ([storeId, data]) => {
        const originLocation = await this.prisma.location.findUnique({
          where: { id: data.store.locationId },
        });
        if (!originLocation || !originLocation.biteship_area_id) {
          return {
            store: { id: storeId, name: data.store.name },
            pricing: [],
            error: 'Origin address not found or invalid.',
          };
        }

        const pricing = await this.checkRates({
          origin_area_id: originLocation.biteship_area_id,
          destination_area_id: destinationLocation.biteship_area_id!,
          couriers: availableCouriers, // Menggunakan daftar kurir dinamis
          items: data.items,
        });

        return {
          store: { id: storeId, name: data.store.name, slug: data.store.slug },
          pricing,
        };
      }),
    );

    return shippingOptionsByStore;
  }

  private async checkRates(
    checkRatesDto: CheckRatesDto & { couriers: string },
  ) {
    const headers = { Authorization: this.biteshipApiKey };
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.biteshipBaseUrl}/v1/rates/couriers`,
          checkRatesDto,
          { headers },
        ),
      );
      return response.data.pricing || [];
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'Biteship Rate Check Error:',
          error['response']?.data || error.message,
        );
      }
      return [];
    }
  }

  private async getAvailableCouriers(): Promise<string> {
    const headers = { Authorization: this.biteshipApiKey };
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.biteshipBaseUrl}/v1/couriers`, {
          headers,
        }),
      );
      // Mengambil semua courier_code dan menggabungkannya menjadi string
      const courierCodes = response.data.couriers
        .map((c) => c.courier_code)
        .join(',');
      return courierCodes;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'Failed to fetch available couriers from Biteship:',
          error['response']?.data || error.message,
        );
      }
      return 'jne,jnt,sicepat,anteraja';
    }
  }
}
