"use client";

import { api } from "@/features/auth/api/authApi";
import { Category } from "../types";

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data kategori:", error);
    throw new Error("Tidak dapat memuat kategori.");
  }
};
