"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { createProduct, uploadImage } from "../api/sellApi";
import {
  CreateProductPayload,
  CreateVariantPayload,
  Condition,
  ListingData,
} from "../types";

const createUniqueSlug = (title: string) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const uniqueId = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${uniqueId}`;
};

export const useSellProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const listProduct = async (listingData: ListingData, files: File[]) => {
    if (files.length === 0) {
      toast.error("Silakan unggah setidaknya satu foto.");
      return;
    }
    if (
      !listingData.categoryId ||
      !listingData.name ||
      !listingData.price ||
      !listingData.condition
    ) {
      toast.error("Harap lengkapi semua kolom yang wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      toast.info("Mengunggah gambar...", { id: "upload-toast" });
      const uploadPromises = files.map((file) => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);
      toast.success("Gambar berhasil diunggah!", { id: "upload-toast" });

      const finalSize =
        listingData.size === "OTHER"
          ? listingData.customSize
          : listingData.size;
      const finalColor =
        listingData.color === "OTHER"
          ? listingData.customColor
          : listingData.color;

      const variantPayload: CreateVariantPayload = {
        size: finalSize || undefined,
        color: finalColor || undefined,
        price: parseInt(listingData.price, 10) || 0,
        stock: Number(listingData.stock) || 1,
        condition: listingData.condition as Condition,
        conditionNote: listingData.conditionNote || undefined,
        weight: parseInt(listingData.weight, 10) || 0,
        length: parseInt(listingData.length, 10) || 0,
        width: parseInt(listingData.width, 10) || 0,
        height: parseInt(listingData.height, 10) || 0,
      };

      const productPayload: CreateProductPayload = {
        name: listingData.name,
        slug: createUniqueSlug(listingData.name),
        description: listingData.description,
        images: imageUrls,
        categoryId: listingData.categoryId,
        isPreloved: listingData.isPreloved,
        variants: [variantPayload],
      };

      toast.info("Membuat listing Anda...");
      await createProduct(productPayload);

      toast.success("Listing berhasil dibuat!", {
        description: "Anda akan segera diarahkan.",
      });

      router.push("/");
    } catch (error: unknown) {
      let errorMessage = "Terjadi kesalahan yang tidak terduga.";
      if (axios.isAxiosError(error)) {
        console.error("Backend validation error:", error.response?.data);
        errorMessage =
          error.response?.data?.message || "Gagal membuat listing.";
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(" ");
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Gagal membuat listing:", error);
      toast.error("Gagal membuat listing", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { listProduct, isLoading };
};
