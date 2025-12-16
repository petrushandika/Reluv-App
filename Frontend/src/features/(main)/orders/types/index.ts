export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  total: number;
  variant: {
    id: number;
    size: string;
    color: string;
    image: string;
    product: {
      id: number;
      name: string;
      slug: string;
      images: string[];
    };
  };
}

export interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  itemsAmount: number;
  shippingCost: number;
  discountAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  buyer?: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
  };
  voucherCode?: string | null;
  notes?: string | null;
  payment?: {
    id: number;
    method: string;
    amount: number;
    status: string;
    snap_token: string | null;
    snap_redirect_url: string | null;
    midtrans_order_id: string | null;
    paidAt: string | null;
    expiresAt: string | null;
    createdAt: string;
  };
  shipment?: {
    id: number;
    courier: string;
    service: string;
    trackingNumber: string | null;
    status: string;
    estimatedDays: number | null;
    shippingCost: number;
    shippedAt: string | null;
    deliveredAt: string | null;
    createdAt: string;
  };
  location?: {
    id: number;
    label: string;
    recipient: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    subDistrict: string;
    postalCode: string;
    address: string;
  };
}

