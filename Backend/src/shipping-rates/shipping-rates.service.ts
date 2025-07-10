import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadGatewayException,
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
              include: {
                product: true,
              },
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
      throw new NotFoundException(
        'Destination address not found or does not have a valid shipping area ID.',
      );
    }

    const firstItem = cart.items[0];
    const sellerId = firstItem.variant.product.sellerId;
    const originLocation = await this.prisma.location.findFirst({
      where: { store: { userId: sellerId } },
    });
    if (!originLocation || !originLocation.biteship_area_id) {
      throw new NotFoundException(
        "Seller's origin address could not be found or does not have a valid shipping area ID.",
      );
    }

    const itemsForBiteship = cart.items.map((item) => ({
      name: item.variant.product.name,
      description: item.variant.name || 'Product Variant',
      value: item.variant.price,
      weight: item.variant.weight,
      quantity: item.quantity,
    }));

    return this.checkRates({
      origin_area_id: originLocation.biteship_area_id,
      destination_area_id: destinationLocation.biteship_area_id,
      items: itemsForBiteship,
    });
  }

  async checkRates(checkRatesDto: CheckRatesDto) {
    const headers = { Authorization: this.biteshipApiKey };
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.biteshipBaseUrl}/v1/rates/couriers`,
          checkRatesDto,
          { headers },
        ),
      );
      return response.data.pricing;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          'Biteship Rate Check Error:',
          error['response']?.data || error.message,
        );
      }
      throw new BadGatewayException(
        'Failed to retrieve shipping rates from provider.',
      );
    }
  }
}
