"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  ChevronLeft,
  X,
  ImagePlus,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";
import Spinner from "@/shared/components/atoms/Spinner";
import {
  getProductById,
  updateProduct,
  updateProductVariant,
} from "@/features/products/api/productsApi";
import { Product, Variant, Condition } from "@/features/products/types";
import { toast } from "sonner";
import Image from "next/image";
import CustomSelect from "@/shared/components/molecules/CustomSelect";
import CategorySelector from "@/shared/components/molecules/CategorySelector";
import { uploadImage } from "@/features/sell/api/sellApi";

const sizeOptions = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
  { value: "OTHER", label: "Another Size..." },
];

const colorOptions = [
  { value: "Red", label: "Red" },
  { value: "Blue", label: "Blue" },
  { value: "Black", label: "Black" },
  { value: "White", label: "White" },
  { value: "Green", label: "Green" },
  { value: "Yellow", label: "Yellow" },
  { value: "OTHER", label: "Another Color..." },
];

const productSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Listing title is required" })
    .max(255, { message: "Listing title must be at most 255 characters" })
    .trim(),
  description: z
    .string()
    .max(10000, { message: "Description must be at most 10000 characters" })
    .optional()
    .or(z.literal("")),
  categoryId: z.number().min(1, { message: "Category is required" }).nullable(),
  images: z.array(z.string()).min(1, { message: "At least one image is required" }),
  isPreloved: z.boolean(),
});

const variantSchema = z.object({
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"], {
    required_error: "Condition is required",
  }),
  conditionNote: z
    .string()
    .max(500, { message: "Condition note must be at most 500 characters" })
    .optional()
    .or(z.literal("")),
  price: z.number().min(0, { message: "Price must be 0 or greater" }).max(999999999, { message: "Price must be less than 1 billion" }),
  stock: z.number().min(0, { message: "Stock must be 0 or greater" }).max(999999, { message: "Stock must be less than 1 million" }),
  weight: z.number().min(1, { message: "Weight must be at least 1 gram" }).max(999999, { message: "Weight must be less than 1 million grams" }).optional(),
  length: z.number().min(1, { message: "Length must be at least 1 cm" }).max(9999, { message: "Length must be less than 10000 cm" }).optional(),
  width: z.number().min(1, { message: "Width must be at least 1 cm" }).max(9999, { message: "Width must be less than 10000 cm" }).optional(),
  height: z.number().min(1, { message: "Height must be at least 1 cm" }).max(9999, { message: "Height must be less than 10000 cm" }).optional(),
  size: z.string().max(50, { message: "Size must be at most 50 characters" }).optional().nullable(),
  color: z.string().max(50, { message: "Color must be at most 50 characters" }).optional().nullable(),
});

const EditProductPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [] as string[],
    categoryId: null as number | null,
    isPreloved: true,
  });
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxTotalImages = 9;
  const [newImageFiles, setNewImageFiles] = useState<(File | null)[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [variantErrors, setVariantErrors] = useState<Record<number, Record<string, string>>>({});

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = searchParams.get("id");
      if (!productId) {
        toast.error("Product ID is required");
        router.push("/profile/product");
        return;
      }

      try {
        setIsLoading(true);
        const productData = await getProductById(parseInt(productId));
        setProduct(productData);
        setFormData({
          name: productData.name,
          description: productData.description,
          images: productData.images || [],
          categoryId: productData.categoryId,
          isPreloved: productData.isPreloved,
        });
        setVariants(productData.variants || []);
        setNewImageFiles(new Array(productData.images?.length || 0).fill(null));
      } catch (error) {
        console.error("Failed to fetch product:", error);
        const errorMessage = error instanceof Error ? error.message : "Unable to load product.";
        toast.error("Failed to Load Product", {
          description: errorMessage,
        });
        router.push("/profile/product");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchProduct();
    }
  }, [searchParams, isAuthenticated, router]);

  const handleSaveProduct = async () => {
    if (!product) return;

    setValidationError(null);
    setFieldErrors({});
    setVariantErrors({});

    const productValidation = productSchema.safeParse({
      ...formData,
      categoryId: formData.categoryId,
    });

    if (!productValidation.success) {
      const errors: Record<string, string> = {};
      productValidation.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as string;
          errors[fieldName] = err.message;
        } else {
          setValidationError(err.message);
        }
      });
      setFieldErrors(errors);
      if (Object.keys(errors).length === 0 && productValidation.error.errors[0]) {
        setValidationError(productValidation.error.errors[0].message);
      }
      return;
    }

    const variantValidationErrors: Record<number, Record<string, string>> = {};
    let hasVariantErrors = false;

    for (const variant of variants) {
      const variantValidation = variantSchema.safeParse({
        condition: variant.condition,
        conditionNote: variant.conditionNote || "",
        price: variant.price,
        stock: variant.stock,
        weight: variant.weight || undefined,
        length: variant.length || undefined,
        width: variant.width || undefined,
        height: variant.height || undefined,
        size: variant.size || null,
        color: variant.color || null,
      });

      if (!variantValidation.success) {
        const errors: Record<string, string> = {};
        variantValidation.error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const fieldName = err.path[0] as string;
            errors[fieldName] = err.message;
          }
        });
        variantValidationErrors[variant.id] = errors;
        hasVariantErrors = true;
      }
    }

    if (hasVariantErrors) {
      setVariantErrors(variantValidationErrors);
      toast.error("Validation Failed", {
        description: "Please fix the errors in the form before saving.",
      });
      return;
    }

    try {
      setIsSaving(true);

      const finalImages = [...formData.images];
      const filesToUpload = newImageFiles.filter((file): file is File => file !== null);
      
      if (filesToUpload.length > 0) {
        toast.info("Uploading Images", {
          description: "Please wait while we upload your new images...",
          id: "upload-toast",
        });

        const uploadPromises = filesToUpload.map((file) => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        
        let uploadIndex = 0;
        finalImages.forEach((url, index) => {
          if (newImageFiles[index] !== null) {
            finalImages[index] = uploadedUrls[uploadIndex];
            if (url.startsWith('blob:')) {
              URL.revokeObjectURL(url);
            }
            uploadIndex++;
          }
        });

        toast.success("Images Uploaded", {
          description: "All images have been uploaded successfully!",
          id: "upload-toast",
        });
      }
      
      await updateProduct(product.id, {
        name: formData.name,
        description: formData.description,
        images: finalImages,
        categoryId: formData.categoryId || undefined,
        isPreloved: formData.isPreloved,
      });

      for (const variant of variants) {
        await updateProductVariant(product.id, variant.id, {
          size: variant.size || undefined,
          color: variant.color || undefined,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice || undefined,
          stock: variant.stock,
          condition: variant.condition,
          conditionNote: variant.conditionNote || undefined,
          weight: variant.weight,
          length: variant.length,
          width: variant.width,
          height: variant.height,
        });
      }

      toast.success("Product Updated", {
        description: "Product and all variants have been updated successfully.",
      });
      router.push("/profile/product");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to update product.";
      toast.error("Failed to Update Product", {
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };



  const handleVariantChange = (
    variantId: number,
    field: keyof Variant,
    value: string | number | Condition | null
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );
    if (variantErrors[variantId]?.[field]) {
      setVariantErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[variantId]) {
          const variantErrs = { ...newErrors[variantId] };
          delete variantErrs[field];
          if (Object.keys(variantErrs).length === 0) {
            delete newErrors[variantId];
          } else {
            newErrors[variantId] = variantErrs;
          }
        }
        return newErrors;
      });
    }
  };

  const formatPrice = (value: number): string => {
    if (!value) return "";
    return value.toLocaleString("id-ID");
  };

  const handlePriceChange = (variantId: number, value: string) => {
    const numericValue = value.replace(/\./g, "");
    if (!numericValue) {
      handleVariantChange(variantId, "price", 0);
      return;
    }
    const number = parseInt(numericValue, 10);
    if (!isNaN(number)) {
      handleVariantChange(variantId, "price", number);
    }
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const currentCount = formData.images.length;
      const remainingSlots = maxTotalImages - currentCount;

      if (remainingSlots <= 0) {
        toast.warning('Upload Limit Reached', {
          description: `Maximum ${maxTotalImages} images allowed. No images were added.`,
        });
        return;
      }

      if (newFiles.length > remainingSlots) {
        const filesToAdd = newFiles.slice(0, remainingSlots);
        const rejectedCount = newFiles.length - remainingSlots;

        const newImageUrls = filesToAdd.map((file) => URL.createObjectURL(file));
        setFormData({
          ...formData,
          images: [...formData.images, ...newImageUrls],
        });
        setNewImageFiles([...newImageFiles, ...filesToAdd]);

        toast.warning('Upload Limit Reached', {
          description: `Maximum ${maxTotalImages} images allowed. ${rejectedCount} image(s) were not added.`,
        });
      } else {
        const newImageUrls = newFiles.map((file) => URL.createObjectURL(file));
        setFormData({
          ...formData,
          images: [...formData.images, ...newImageUrls],
        });
        setNewImageFiles([...newImageFiles, ...newFiles]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };


  if (isLoading) {
    return <Spinner />;
  }

  if (!product) {
    return null;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900 w-full flex items-center justify-center p-3 sm:p-4">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-4 sm:py-5">
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => router.push("/profile/product")}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Edit Product
              </h1>
            </button>
          </div>

          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              handleSaveProduct(); 
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
              <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-8 lg:self-start">
                {formData.images.length > 0 ? (
                  <>
                    {formData.images[0] && (
                      <div className="relative group w-full">
                        <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent group-hover:border-sky-500 dark:group-hover:border-sky-400 transition-colors">
                          <Image
                            src={formData.images[0]}
                            alt="cover image"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute top-2 left-2 bg-black bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-80 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            COVER
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const imageUrl = formData.images[0];
                              if (imageUrl.startsWith('blob:')) {
                                URL.revokeObjectURL(imageUrl);
                              }
                              setFormData({
                                ...formData,
                                images: formData.images.filter((_, i) => i !== 0),
                              });
                              setNewImageFiles(newImageFiles.filter((_, i) => i !== 0));
                            }}
                            className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 sm:p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            aria-label="Remove cover image"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      {formData.images.slice(1).map((image, index) => {
                        const actualIndex = index + 1;
                        return (
                          <div key={actualIndex} className="relative group aspect-square">
                            <div className="relative w-full h-full rounded-md overflow-hidden border-2 border-transparent group-hover:border-sky-500 dark:group-hover:border-sky-400 transition-colors">
                              <Image
                                src={image}
                                alt={`preview ${actualIndex}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const imageUrl = formData.images[actualIndex];
                                if (imageUrl.startsWith('blob:')) {
                                  URL.revokeObjectURL(imageUrl);
                                }
                                setFormData({
                                  ...formData,
                                  images: formData.images.filter((_, i) => i !== actualIndex),
                                });
                                setNewImageFiles(newImageFiles.filter((_, i) => i !== actualIndex));
                              }}
                            className="absolute top-1 right-1 bg-red-500 dark:bg-red-600 text-white rounded-full p-0.5 sm:p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            aria-label="Remove image"
                          >
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                          </div>
                        );
                      })}

                      {formData.images.length < maxTotalImages && (
                        <>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e.target.files)}
                          />
                          <div
                            className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed transition-colors duration-300 ${
                              isDragging
                                ? "border-sky-400 dark:border-sky-500 bg-sky-200 dark:bg-sky-900/30"
                                : "border-sky-500 dark:border-sky-400 bg-sky-100 dark:bg-sky-900/20"
                            } text-sky-800 dark:text-sky-300 cursor-pointer`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <ImagePlus className="h-6 w-6 sm:h-8 sm:w-8 text-sky-500 dark:text-sky-400" />
                            <p className="mt-1 text-[10px] sm:text-xs text-center">Add more</p>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
                    <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
                      No images available
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-4 sm:p-6 rounded-lg space-y-4 sm:space-y-6 bg-white dark:bg-gray-800 shadow-sm">
                <div>
                  <h5 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                    Product Details
                  </h5>
                </div>
                
                <CategorySelector
                  selectedCategoryId={formData.categoryId}
                  onSelectCategory={(id) =>
                    setFormData({ ...formData, categoryId: id })
                  }
                />

                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2"
                  >
                    Listing Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (fieldErrors.name) {
                        setFieldErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.name;
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="e.g. Vintage Leather Handbag"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                      fieldErrors.name
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    required
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {variants.length > 0 && variants[0] && (
                  <div>
                    <h4 className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-2">
                      About the item
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2">
                          Condition <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"] as Condition[]).map((condition) => (
                            <button
                              key={condition}
                              type="button"
                              onClick={() =>
                                handleVariantChange(variants[0].id, "condition", condition)
                              }
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full border transition-colors cursor-pointer ${
                                variants[0].condition === condition
                                  ? "bg-sky-600 text-white border-sky-600"
                                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                              }`}
                            >
                              {condition === "NEW" && "New"}
                              {condition === "LIKE_NEW" && "Like New"}
                              {condition === "GOOD" && "Good"}
                              {condition === "FAIR" && "Fair"}
                              {condition === "POOR" && "Poor"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="conditionNote"
                          className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Condition Note (Optional)
                        </label>
                        <input
                          type="text"
                          id="conditionNote"
                          value={variants[0].conditionNote || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              variants[0].id,
                              "conditionNote",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                            variantErrors[variants[0].id]?.conditionNote
                              ? "border-red-500 dark:border-red-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          placeholder="e.g. Slight scratch on the buckle"
                        />
                        {variantErrors[variants[0].id]?.conditionNote && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            {variantErrors[variants[0].id].conditionNote}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label
                            htmlFor="price"
                            className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1"
                          >
                            Price (IDR) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              Rp
                            </span>
                            <input
                              type="text"
                              id="price"
                              value={formatPrice(variants[0].price)}
                              onChange={(e) => handlePriceChange(variants[0].id, e.target.value)}
                              placeholder="0"
                              className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                                variantErrors[variants[0].id]?.price
                                  ? "border-red-500 dark:border-red-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                              required
                            />
                          </div>
                          {variantErrors[variants[0].id]?.price && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                              {variantErrors[variants[0].id].price}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="stock"
                            className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1"
                          >
                            Stock
                          </label>
                          <input
                            type="number"
                            id="stock"
                            value={variants[0].stock}
                            onChange={(e) =>
                              handleVariantChange(
                                variants[0].id,
                                "stock",
                                parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="1"
                            min="0"
                            max="999999"
                            className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                              variantErrors[variants[0].id]?.stock
                                ? "border-red-500 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          {variantErrors[variants[0].id]?.stock && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                              {variantErrors[variants[0].id].stock}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {variants.length > 0 && variants[0] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <CustomSelect
                      label="Size (Optional)"
                      placeholder="Select a size"
                      options={sizeOptions}
                      value={
                        variants[0].size && sizeOptions.find(opt => opt.value === variants[0].size)
                          ? variants[0].size
                          : variants[0].size
                            ? "OTHER"
                            : ""
                      }
                      onChange={(value) => {
                        if (value === "OTHER") {
                          handleVariantChange(variants[0].id, "size", "OTHER");
                        } else {
                          handleVariantChange(variants[0].id, "size", value || null);
                        }
                      }}
                      allowCustom={true}
                      customPlaceholder="Enter custom size"
                      onCustomChange={(value) =>
                        handleVariantChange(variants[0].id, "size", value || null)
                      }
                      customValue={
                        variants[0].size && !sizeOptions.find(opt => opt.value === variants[0].size)
                          ? variants[0].size
                          : ""
                      }
                    />
                    <CustomSelect
                      label="Color (Optional)"
                      placeholder="Select a color"
                      options={colorOptions}
                      value={
                        variants[0].color && colorOptions.find(opt => opt.value === variants[0].color)
                          ? variants[0].color
                          : variants[0].color
                            ? "OTHER"
                            : ""
                      }
                      onChange={(value) => {
                        if (value === "OTHER") {
                          handleVariantChange(variants[0].id, "color", "OTHER");
                        } else {
                          handleVariantChange(variants[0].id, "color", value || null);
                        }
                      }}
                      allowCustom={true}
                      customPlaceholder="Enter custom color"
                      onCustomChange={(value) =>
                        handleVariantChange(variants[0].id, "color", value || null)
                      }
                      customValue={
                        variants[0].color && !colorOptions.find(opt => opt.value === variants[0].color)
                          ? variants[0].color
                          : ""
                      }
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="description"
                    className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (fieldErrors.description) {
                        setFieldErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.description;
                          return newErrors;
                        });
                      }
                    }}
                    rows={4}
                    placeholder="Describe your item in detail..."
                    maxLength={10000}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none ${
                      fieldErrors.description
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                  {fieldErrors.description && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">
                      {fieldErrors.description}
                    </p>
                  )}
                  {!fieldErrors.description && formData.description.length > 9500 && (
                    <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 mt-1">
                      {10000 - formData.description.length} characters remaining
                    </p>
                  )}
                </div>

                {variants.length > 0 && variants[0] && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Shipping Details (Optional)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                      <div>
                        <label
                          htmlFor="weight"
                          className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Weight (g)
                        </label>
                        <input
                          type="number"
                          id="weight"
                          value={variants[0].weight}
                          onChange={(e) =>
                            handleVariantChange(
                              variants[0].id,
                              "weight",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="e.g. 500"
                          min="1"
                          max="999999"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="length"
                          className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Length (cm)
                        </label>
                        <input
                          type="number"
                          id="length"
                          value={variants[0].length}
                          onChange={(e) =>
                            handleVariantChange(
                              variants[0].id,
                              "length",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="e.g. 20"
                          min="1"
                          max="9999"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="width"
                          className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Width (cm)
                        </label>
                        <input
                          type="number"
                          id="width"
                          value={variants[0].width}
                          onChange={(e) =>
                            handleVariantChange(
                              variants[0].id,
                              "width",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="e.g. 15"
                          min="1"
                          max="9999"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="height"
                          className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          id="height"
                          value={variants[0].height}
                          onChange={(e) =>
                            handleVariantChange(
                              variants[0].id,
                              "height",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="e.g. 10"
                          min="1"
                          max="9999"
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    id="isPreloved"
                    name="isPreloved"
                    type="checkbox"
                    checked={formData.isPreloved}
                    onChange={(e) =>
                      setFormData({ ...formData, isPreloved: e.target.checked })
                    }
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600 focus:ring-sky-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 cursor-pointer"
                  />
                  <label
                    htmlFor="isPreloved"
                    className="ml-2 block text-xs sm:text-sm text-gray-900 dark:text-gray-300 cursor-pointer"
                  >
                    This is a pre-loved item
                  </label>
                </div>

                {validationError && (
                  <div className="flex items-center p-3 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {fieldErrors.categoryId && (
                  <div className="flex items-center p-3 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                    <span>{fieldErrors.categoryId}</span>
                  </div>
                )}

                {fieldErrors.images && (
                  <div className="flex items-center p-3 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                    <span>{fieldErrors.images}</span>
                  </div>
                )}

                {variants.length > 0 && variants[0] && variantErrors[variants[0].id]?.condition && (
                  <div className="flex items-center p-3 text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                    <span>{variantErrors[variants[0].id].condition}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSaving || !formData.name || Object.keys(fieldErrors).length > 0 || Object.keys(variantErrors).length > 0}
                  className="w-full bg-sky-600 dark:bg-sky-500 text-white font-bold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default EditProductPage;

