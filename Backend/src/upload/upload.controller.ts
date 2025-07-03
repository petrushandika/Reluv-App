import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure you have uploaded a file');
    }

    try {
      const result = await this.cloudinaryService.uploadFile(
        file,
        'general-uploads',
      );
      return {
        message: 'Image uploaded successfully',
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to upload image: ${error.message}`,
        );
      }
      throw new BadRequestException(
        'An unknown error occurred during image upload.',
      );
    }
  }
}
