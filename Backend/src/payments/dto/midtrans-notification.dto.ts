import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MidtransNotificationDto {
  @IsString()
  @IsNotEmpty()
  transaction_time: string;

  @IsEnum(['capture', 'settlement', 'pending', 'deny', 'expire', 'cancel'])
  @IsNotEmpty()
  transaction_status:
    | 'capture'
    | 'settlement'
    | 'pending'
    | 'deny'
    | 'expire'
    | 'cancel';

  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsString()
  @IsNotEmpty()
  status_code: string;

  @IsString()
  @IsNotEmpty()
  signature_key: string;

  @IsString()
  @IsNotEmpty()
  payment_type: string;

  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  merchant_id: string;

  @IsString()
  @IsNotEmpty()
  gross_amount: string;

  @IsString()
  @IsOptional()
  fraud_status?: 'accept' | 'deny' | 'challenge';
}
