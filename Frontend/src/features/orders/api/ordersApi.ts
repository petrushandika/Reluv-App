"use client";

import { api } from "@/shared/lib/axios";
import { Order } from "../types";

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get<Order[]>("/orders");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw error;
  }
};

export const getOrder = async (id: number): Promise<Order> => {
  try {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderByOrderNumber = async (
  orderNumber: string
): Promise<Order> => {
  try {
    const response = await api.get<Order>(`/orders/order-number/${orderNumber}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

