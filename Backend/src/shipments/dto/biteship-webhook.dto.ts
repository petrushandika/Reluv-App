import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class HistoryDto {
  @IsString()
  note: string;

  @IsString()
  status: string;

  @IsString()
  updated_at: string;
}

class BiteshipWebhookDataDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  courier_tracking_number?: string;

  @IsString()
  @IsOptional()
  courier_name?: string;

  @IsString()
  @IsOptional()
  courier_service?: string;

  @IsString()
  @IsOptional()
  waybill_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoryDto)
  history: HistoryDto[];
}

export class BiteshipWebhookDto {
  @IsString()
  @IsNotEmpty()
  event: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => BiteshipWebhookDataDto)
  data: BiteshipWebhookDataDto;
}
