"use client";

import { api } from "@/shared/lib/axios";
import {
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../types";

export const getAddresses = async (): Promise<Address[]> => {
  try {
    const response = await api.get<Address[]>("/locations", {
      params: { page: 1, limit: 100 },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    throw error;
  }
};

export const getAddress = async (id: number): Promise<Address> => {
  try {
    const response = await api.get<Address>(`/locations/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch address:", error);
    throw error;
  }
};

export const createAddress = async (
  data: CreateAddressPayload
): Promise<Address> => {
  try {
    const response = await api.post<Address>("/locations", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create address:", error);
    throw error;
  }
};

export const updateAddress = async (
  id: number,
  data: UpdateAddressPayload
): Promise<Address> => {
  try {
    const response = await api.patch<Address>(`/locations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update address:", error);
    throw error;
  }
};

export const deleteAddress = async (id: number): Promise<void> => {
  try {
    await api.delete(`/locations/${id}`);
  } catch (error) {
    console.error("Failed to delete address:", error);
    throw error;
  }
};

