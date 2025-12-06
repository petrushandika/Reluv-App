"use client";

import { api } from "@/shared/lib/axios";
import { Category } from "../types";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  } catch (error) {
    throw new Error("Tidak dapat memuat kategori.");
  }
};
