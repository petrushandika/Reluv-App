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
        'Biteship configuration is missing. Please set BITESHIP_API_KEY and BITESHIP_BASE_URL in environment variables.',
      );
    }
    
    this.biteshipApiKey = apiKey;
    this.biteshipBaseUrl = baseUrl.replace(/\/$/, '');
  }

  private async findAreaIdByCityName(cityName: string): Promise<string | null> {
    if (!cityName || cityName.trim().length === 0) {
      return null;
    }

    const cleanedName = cityName.trim();
    const searchVariations = [
      cleanedName,
      cleanedName.replace(/^KABUPATEN\s+/i, ''),
      cleanedName.replace(/^KOTA\s+/i, ''),
      cleanedName.replace(/^KAB\.\s*/i, ''),
      cleanedName.replace(/^KAB\s+/i, ''),
      cleanedName.replace(/^KOTA\s+/i, '').replace(/^KABUPATEN\s+/i, ''),
      cleanedName.replace(/^KABUPATEN\s+/i, '').replace(/^KOTA\s+/i, ''),
      cleanedName.replace(/KABUPATEN|KOTA|KAB\.|KAB/gi, '').trim(),
    ].filter((v, i, arr) => v && v.trim().length > 0 && arr.indexOf(v) === i);

    for (const searchTerm of searchVariations) {
      try {
        const headers = {
          Authorization: this.biteshipApiKey,
        };
        const params = {
          countries: 'ID',
          input: searchTerm.trim(),
          type: 'single',
        };

        const response = await firstValueFrom(
          this.httpService.get(`${this.biteshipBaseUrl}/v1/maps/areas`, {
            headers,
            params,
            timeout: 10000,
          }),
        );

        if (response.data?.areas && response.data.areas.length > 0) {
          const area = response.data.areas[0];
          const areaId = area.id;
          return areaId;
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status === 400 || status === 404) {
            continue;
          }
        }
        continue;
      }
    }

    return null;
  }

  async checkRatesByArea(checkRatesDto: CheckRatesDto) {
    let destinationAreaId = checkRatesDto.destination_area_id;

    if (!destinationAreaId || !destinationAreaId.startsWith('ID-')) {
      const foundAreaId = await this.findAreaIdByCityName(destinationAreaId);
      if (!foundAreaId) {
        throw new BadGatewayException(
          `Could not find area ID for destination: ${destinationAreaId}. Please check the destination city name.`,
        );
      }
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
    if (!this.biteshipApiKey || !this.biteshipBaseUrl) {
      throw new InternalServerErrorException(
        'Shipping service is not configured. Please contact administrator.',
      );
    }

    const headers = { 
      Authorization: this.biteshipApiKey,
      'Content-Type': 'application/json',
    };
    
    const requestUrl = `${this.biteshipBaseUrl}/v1/rates/couriers`;
    
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          requestUrl,
          payload,
          { 
            headers,
            timeout: 30000,
          },
        ),
      );
      
      return { pricing: response.data.pricing || [] };
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data;
        const status = error.response?.status;
        const errorMessage = errorData?.message || errorData?.error || error.message;
        const code = error.code;
        
        if (code === 'ECONNREFUSED' || code === 'ENOTFOUND' || code === 'ETIMEDOUT') {
          throw new BadGatewayException(
            `Cannot connect to shipping provider. Please check BITESHIP_BASE_URL configuration. Error: ${code}`,
          );
        }
        
        if (status === 400) {
          throw new BadGatewayException(
            `Invalid shipping rate request: ${errorMessage || 'Bad request to shipping provider'}`,
          );
        }
        
        if (status === 401 || status === 403) {
          throw new BadGatewayException(
            'Authentication failed with shipping provider. Please check BITESHIP_API_KEY configuration.',
          );
        }
        
        if (status === 404) {
          throw new BadGatewayException(
            `Shipping rates not found for the specified destination: ${errorMessage || 'Destination not found'}`,
          );
        }
        
        if (status === 500 || status === 502 || status === 503) {
          throw new BadGatewayException(
            `Shipping service temporarily unavailable (${status}): ${errorMessage || 'Service error'}`,
          );
        }
        
        if (status && status >= 400 && status < 500) {
          throw new BadGatewayException(
            `Shipping rate request failed (${status}): ${errorMessage || 'Client error'}`,
          );
        }
        
        if (status) {
          throw new BadGatewayException(
            `Shipping rate request failed (${status}): ${errorMessage || 'Server error'}`,
          );
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      throw new BadGatewayException(
        `Failed to retrieve shipping rates: ${errorMessage}. Please check BITESHIP_API_KEY and BITESHIP_BASE_URL configuration.`,
      );
    }
  }
}
