import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  BadGatewayException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class MapsService {
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

  async searchAreas(query: string) {
    const headers = {
      Authorization: this.biteshipApiKey,
    };
    const params = {
      countries: 'ID',
      input: query,
      type: 'single',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.biteshipBaseUrl}/v1/maps/areas`, {
          headers,
          params,
        }),
      );
      return response.data.areas;
    } catch (error) {
      if (error instanceof AxiosError) {
      }
      throw new BadGatewayException(
        'Failed to search for areas from the provider.',
      );
    }
  }

  async searchOpenStreetMap(query: string) {
    const params = {
      q: query,
      format: 'json',
      addressdetails: 1,
      limit: 5,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get('https://nominatim.openstreetmap.org/search', {
          params,
        }),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
      }
      throw new BadGatewayException(
        'Failed to retrieve location data from provider.',
      );
    }
  }
}
