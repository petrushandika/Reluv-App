export class MidtransNotificationDto {
  transaction_time: string;
  transaction_status:
    | 'capture'
    | 'settlement'
    | 'pending'
    | 'deny'
    | 'expire'
    | 'cancel';
  transaction_id: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  gross_amount: string;
  fraud_status?: 'accept' | 'deny' | 'challenge';
}
