import { api } from "@/shared/lib/axios";

export interface CheckShippingRatesDto {
  origin_area_id: string;
  destination_area_id: string;
  items: Array<{
    name: string;
    description: string;
    value: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    quantity: number;
  }>;
}

export interface ShippingRate {
  courier: {
    code: string;
    name: string;
  };
  courier_service_name: string;
  courier_service_code: string;
  description: string;
  duration: string;
  price: number;
}

export interface CreateOrderDto {
  locationId: number;
  shippingCost: number;
  notes?: string;
  voucherCode?: string;
}

export interface CreateOrderResponse {
  order: {
    id: number;
    orderNumber: string;
    totalAmount: number;
    itemsAmount: number;
    shippingCost: number;
    discountAmount: number;
    status: string;
  };
  payment: {
    token: string;
    redirect_url: string;
  };
}

export const checkShippingRates = async (
  data: CheckShippingRatesDto
): Promise<ShippingRate[]> => {
  try {
    const response = await api.post<{ pricing: ShippingRate[] }>(
      "/shipping-rates/check-by-area",
      data
    );
    return response.data.pricing || [];
  } catch (error) {
    console.error("Failed to check shipping rates:", error);
    throw error;
  }
};

export const checkShippingRatesByCoords = async (data: {
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  items: Array<{
    name: string;
    description: string;
    value: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    quantity: number;
  }>;
}): Promise<ShippingRate[]> => {
  try {
    const response = await api.post<{ pricing: ShippingRate[] }>(
      "/shipping-rates/check-by-coords",
      data
    );
    return response.data.pricing || [];
  } catch (error) {
    console.error("Failed to check shipping rates by coordinates:", error);
    throw error;
  }
};

export const createOrder = async (
  data: CreateOrderDto
): Promise<CreateOrderResponse> => {
  try {
    const response = await api.post<CreateOrderResponse>("/orders", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

