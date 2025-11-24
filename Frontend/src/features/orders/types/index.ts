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
}

