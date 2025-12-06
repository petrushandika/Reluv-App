import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  BadGatewayException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface CacheEntry {
  data: any;
  timestamp: number;
}

@Injectable()
export class GeocodeService {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000;
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 1000;

  constructor(private readonly httpService: HttpService) {}

  private getCacheKey(lat: number, lon: number): string {
    return `${lat.toFixed(6)},${lon.toFixed(6)}`;
  }

  private async ensureRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const delay = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
  }

  async reverseGeocode(lat: number, lon: number) {
    const cacheKey = this.getCacheKey(lat, lon);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    await this.ensureRateLimit();

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&zoom=18`;
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'Reluv-App/1.0 (contact@reluv.app)',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          timeout: 10000,
        }),
      );

      if (response.data) {
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });

        if (this.cache.size > 1000) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }

        return response.data;
      }

      throw new BadGatewayException('Invalid response from geocoding service');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 429) {
          throw new BadGatewayException(
            'Rate limit exceeded. Please try again later.',
          );
        }
        if (error.response?.status === 403) {
          throw new BadGatewayException(
            'Access forbidden by geocoding service.',
          );
        }
      } else {
      }
      throw new BadGatewayException('Failed to fetch address data.');
    }
  }
}
