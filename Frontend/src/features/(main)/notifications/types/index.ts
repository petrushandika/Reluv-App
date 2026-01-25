export type NotificationType =
  | 'ORDER_CREATED'
  | 'ORDER_PAID'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'REVIEW_RECEIVED'
  | 'PRODUCT_LOW_STOCK'
  | 'VOUCHER_APPLIED'
  | 'PAYMENT_FAILED'
  | 'SHIPMENT_UPDATED';

export interface Notification {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  data: any;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string; // Optional, derived from type/data usually
}

export interface NotificationResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
