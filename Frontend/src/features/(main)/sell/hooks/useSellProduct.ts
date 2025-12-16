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
      toast.error("Photo Required", {
        description: "Please upload at least one photo to continue.",
      });
      return;
    }

    const numericPrice = listingData.price.replace(/\./g, "");
    const priceValue = parseFloat(numericPrice) || 0;

    if (!listingData.categoryId) {
      toast.error("Category Required", {
        description: "Please select a category for your listing.",
      });
      return;
    }

    if (!listingData.name || !listingData.name.trim()) {
      toast.error("Title Required", {
        description: "Please enter a listing title.",
      });
      return;
    }

    if (listingData.name.trim().length > 255) {
      toast.error("Title Too Long", {
        description: "Listing title must be at most 255 characters.",
      });
      return;
    }

    if (!listingData.condition) {
      toast.error("Condition Required", {
        description: "Please select a condition for your item.",
      });
      return;
    }

    if (!listingData.price || numericPrice === "" || priceValue <= 0) {
      toast.error("Invalid Price", {
        description: "Please enter a valid price (must be greater than 0).",
      });
      return;
    }

    if (priceValue > 999999999) {
      toast.error("Price Too High", {
        description: "Price must be less than 1 billion.",
      });
      return;
    }

    if (listingData.description && listingData.description.length > 10000) {
      toast.error("Description Too Long", {
        description: "Description must be at most 10000 characters.",
      });
      return;
    }

    if (listingData.conditionNote && listingData.conditionNote.length > 500) {
      toast.error("Note Too Long", {
        description: "Condition note must be at most 500 characters.",
      });
      return;
    }

    if (listingData.size === "OTHER" && listingData.customSize) {
      if (listingData.customSize.length > 50) {
        toast.error("Custom Size Too Long", {
          description: "Custom size must be at most 50 characters.",
        });
        return;
      }
    }

    if (listingData.color === "OTHER" && listingData.customColor) {
      if (listingData.customColor.length > 50) {
        toast.error("Custom Color Too Long", {
          description: "Custom color must be at most 50 characters.",
        });
        return;
      }
    }

    const weight = parseInt(listingData.weight, 10);
    if (listingData.weight && !isNaN(weight)) {
      if (weight < 1) {
        toast.error("Invalid Weight", {
          description: "Weight must be at least 1 gram.",
        });
        return;
      } else if (weight > 999999) {
        toast.error("Weight Too High", {
          description: "Weight must be less than 1 million grams.",
        });
        return;
      }
    }

    const length = parseInt(listingData.length, 10);
    if (listingData.length && !isNaN(length)) {
      if (length < 1) {
        toast.error("Invalid Length", {
          description: "Length must be at least 1 cm.",
        });
        return;
      } else if (length > 9999) {
        toast.error("Length Too High", {
          description: "Length must be less than 10000 cm.",
        });
        return;
      }
    }

    const width = parseInt(listingData.width, 10);
    if (listingData.width && !isNaN(width)) {
      if (width < 1) {
        toast.error("Invalid Width", {
          description: "Width must be at least 1 cm.",
        });
        return;
      } else if (width > 9999) {
        toast.error("Width Too High", {
          description: "Width must be less than 10000 cm.",
        });
        return;
      }
    }

    const height = parseInt(listingData.height, 10);
    if (listingData.height && !isNaN(height)) {
      if (height < 1) {
        toast.error("Invalid Height", {
          description: "Height must be at least 1 cm.",
        });
        return;
      } else if (height > 9999) {
        toast.error("Height Too High", {
          description: "Height must be less than 10000 cm.",
        });
        return;
      }
    }

    const stock = Number(listingData.stock);
    if (!isNaN(stock) && stock < 0) {
      toast.error("Invalid Stock", {
        description: "Stock must be 0 or greater.",
      });
      return;
    } else if (!isNaN(stock) && stock > 999999) {
      toast.error("Stock Too High", {
        description: "Stock must be less than 1 million.",
      });
      return;
    }

    setIsLoading(true);
    try {
      toast.info("Uploading Images", {
        description: "Please wait while we upload your images...",
        id: "upload-toast",
      });
      const uploadPromises = files.map((file) => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);
      toast.success("Images Uploaded", {
        description: "All images have been uploaded successfully!",
        id: "upload-toast",
      });

      const finalSize =
        listingData.size === "OTHER"
          ? listingData.customSize
          : listingData.size;
      const finalColor =
        listingData.color === "OTHER"
          ? listingData.customColor
          : listingData.color;

      const numericPrice = listingData.price.replace(/\./g, "");
      const priceValue = parseInt(numericPrice, 10) || 0;

      const variantPayload: CreateVariantPayload = {
        size: finalSize || undefined,
        color: finalColor || undefined,
        price: priceValue,
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

      toast.info("Creating Listing", {
        description: "Please wait while we create your listing...",
      });
      await createProduct(productPayload);

      toast.success("Listing Created", {
        description: "Your listing has been created successfully! You will be redirected shortly.",
      });

      router.push("/");
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message || "Failed to create listing.";
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(" ");
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error("Failed to Create Listing", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { listProduct, isLoading };
};
