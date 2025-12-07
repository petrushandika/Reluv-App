import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  Length,
  ArrayMaxSize,
} from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsOptional()
  @Length(0, 1000, { message: 'Comment must be at most 1000 characters' })
  comment?: string;

  @IsArray()
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  @IsOptional()
  @ArrayMaxSize(5, { message: 'Maximum 5 images allowed' })
  images?: string[];

  @IsInt()
  @IsOptional()
  orderId?: number;
}
