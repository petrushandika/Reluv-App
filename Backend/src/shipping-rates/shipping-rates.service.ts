import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  BadGatewayException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CheckRatesDto } from './dto/check-rates.dto';
import { AxiosError } from 'axios';
import { CheckRatesByCoordsDto } from './dto/check-rates-by-coords.dto';

@Injectable()
export class ShippingRatesService {
  private readonly biteshipApiKey: string;
  private readonly biteshipBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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

  async checkRatesByArea(checkRatesDto: CheckRatesDto) {
    const biteshipPayload = {
      ...checkRatesDto,
      couriers: 'jne,jnt,sicepat,anteraja,gojek,grab',
    };
    return this.sendRateRequest(biteshipPayload);
  }

  async checkRatesByCoords(checkRatesByCoordsDto: CheckRatesByCoordsDto) {
    const biteshipPayload = {
      ...checkRatesByCoordsDto,
      couriers: 'gojek,grab',
    };
    return this.sendRateRequest(biteshipPayload);
  }

  private async sendRateRequest(payload: any) {
    const headers = { Authorization: this.biteshipApiKey };
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.biteshipBaseUrl}/v1/rates/couriers`,
          payload,
          { headers },
        ),
      );
      return response.data.pricing || [];
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          'Biteship Rate Check Error:',
          error.response?.data || error.message,
        );
      }
      throw new BadGatewayException(
        'Failed to retrieve shipping rates from provider.',
      );
    }
  }
}
