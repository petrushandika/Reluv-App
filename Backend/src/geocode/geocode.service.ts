import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeocodeService {
  constructor(private readonly httpService: HttpService) {}

  async reverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your-email@example.com)',
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Nominatim API request failed:', error);
      throw new InternalServerErrorException('Failed to fetch address data.');
    }
  }
}
