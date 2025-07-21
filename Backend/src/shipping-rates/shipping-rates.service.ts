import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
      if (!storeId) {
        continue;
      }

      let storeEntry = itemsByStore.get(storeId);

      if (!storeEntry) {
        storeEntry = { store: item.variant.product.store, items: [] };
        itemsByStore.set(storeId, storeEntry);
      }

      storeEntry.items.push({
        name: item.variant.product.name,
        description: item.variant.name || 'Product Variant',
        value: item.variant.price,
        weight: item.variant.weight,
        length: item.variant.length,
        width: item.variant.width,
        height: item.variant.height,
        quantity: item.quantity,
      });
    }

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

  private async checkRates(checkRatesDto: CheckRatesDto) {
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
      console.error(
        'Biteship Rate Check Error:',
        error.response?.data || error.message,
      );
      return [];
    }
  }
}
