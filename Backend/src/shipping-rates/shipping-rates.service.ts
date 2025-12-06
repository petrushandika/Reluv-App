import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  BadGatewayException,
  BadRequestException,
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

  private async findAreaIdByCityName(cityName: string): Promise<string | null> {
    try {
      const headers = {
        Authorization: this.biteshipApiKey,
      };
      const params = {
        countries: 'ID',
        input: cityName,
        type: 'single',
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.biteshipBaseUrl}/v1/maps/areas`, {
          headers,
          params,
        }),
      );

      if (response.data?.areas && response.data.areas.length > 0) {
        return response.data.areas[0].id;
      }
      return null;
    } catch (error) {
      console.error('Failed to find area ID for city:', cityName, error);
      return null;
    }
  }

  async checkRatesByArea(checkRatesDto: CheckRatesDto) {
    let destinationAreaId = checkRatesDto.destination_area_id;

    if (!destinationAreaId || !destinationAreaId.startsWith('ID-')) {
      console.log('Looking up area ID for city:', destinationAreaId);
      const foundAreaId = await this.findAreaIdByCityName(destinationAreaId);
      if (!foundAreaId) {
        console.error('Could not find area ID for destination:', destinationAreaId);
        throw new BadRequestException(
          `Could not find area ID for destination: ${destinationAreaId}. Please provide a valid Biteship area ID or city name.`,
        );
      }
      console.log('Found area ID:', foundAreaId, 'for city:', destinationAreaId);
      destinationAreaId = foundAreaId;
    }

    const biteshipPayload = {
      origin_area_id: checkRatesDto.origin_area_id,
      destination_area_id: destinationAreaId,
      items: checkRatesDto.items.map(item => ({
        name: item.name,
        description: item.description || item.name,
        value: item.value,
        length: item.length,
        width: item.width,
        height: item.height,
        weight: item.weight,
        quantity: item.quantity,
      })),
      couriers: 'jne,jnt,sicepat,anteraja,gojek,grab',
    };
    
    console.log('Prepared Biteship payload:', JSON.stringify(biteshipPayload, null, 2));
    
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
    const headers = { 
      Authorization: this.biteshipApiKey,
      'Content-Type': 'application/json',
    };
    
    console.log('Sending request to Biteship:', {
      url: `${this.biteshipBaseUrl}/v1/rates/couriers`,
      payload: JSON.stringify(payload, null, 2),
    });
    
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.biteshipBaseUrl}/v1/rates/couriers`,
          payload,
          { 
            headers,
            timeout: 30000,
          },
        ),
      );
      
      console.log('Biteship response received:', {
        status: response.status,
        hasPricing: !!response.data?.pricing,
        pricingCount: response.data?.pricing?.length || 0,
      });
      
      return { pricing: response.data.pricing || [] };
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        const status = error.response?.status;
        const errorMessage = errorData?.message || errorData?.error || error.message;
        
        console.error('Biteship Rate Check Error:', {
          status,
          statusText: error.response?.statusText,
          errorData: JSON.stringify(errorData, null, 2),
          errorMessage,
          requestUrl: error.config?.url,
          requestPayload: payload,
        });
        
        if (status === 400) {
          throw new BadRequestException(
            errorMessage || 'Invalid request to shipping provider. Please check your request data.',
          );
        }
        
        if (status === 401 || status === 403) {
          throw new BadGatewayException(
            'Authentication failed with shipping provider. Please check BITESHIP_API_KEY configuration.',
          );
        }
        
        if (status === 404) {
          throw new BadRequestException(
            'Shipping rates endpoint not found. Please check BITESHIP_BASE_URL configuration.',
          );
        }
        
        if (status === 500 || status === 502 || status === 503) {
          throw new BadGatewayException(
            'Shipping provider is currently unavailable. Please try again later.',
          );
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Unexpected error in sendRateRequest:', errorMessage, error);
      
      throw new BadGatewayException(
        'Failed to retrieve shipping rates from provider. Please try again later.',
      );
    }
  }
}
