import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

// Nama token untuk provider kustom kita
export const CLOUDINARY_PROVIDER = 'Cloudinary';

@Module({
  providers: [
    CloudinaryService,
    {
      provide: CLOUDINARY_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return cloudinary.config({
          cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
        });
      },
    },
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
