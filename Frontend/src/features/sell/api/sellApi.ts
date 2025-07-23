"use client";

import { api } from "@/shared/lib/axios";
import { CreateProductPayload } from "../types";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post<{ url: string }>(
      "/upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.url;
  } catch (error) {
    console.error("Gagal mengunggah gambar:", error);
    throw new Error("Gagal mengunggah gambar.");
  }
};

export const createProduct = async (data: CreateProductPayload) => {
  try {
    const response = await api.post("/products", data);
    return response.data;
  } catch (error) {
    console.error("Gagal membuat produk:", error);
    throw error;
  }
};
