"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  X,
  ImagePlus,
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
          <div className="mb-6">
            <button
              onClick={() => router.push("/profile/product")}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
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
                          <div className="absolute top-2 left-2 bg-black bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-80 text-white text-xs font-bold px-2 py-1 rounded">
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
                            className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            aria-label="Remove cover image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-3">
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
                              className="absolute top-1 right-1 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              aria-label="Remove image"
                            >
                              <X className="w-3 h-3" />
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
                            <ImagePlus className="h-8 w-8 text-sky-500 dark:text-sky-400" />
                            <p className="mt-1 text-xs text-center">Add more</p>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      No images available
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg space-y-6 bg-white dark:bg-gray-800 shadow-sm">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Vintage Leather Handbag"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    required
                  />
                </div>

                {variants.length > 0 && variants[0] && (
                  <div>
                    <h4 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      About the item
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Condition *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"] as Condition[]).map((condition) => (
                            <button
                              key={condition}
                              type="button"
                              onClick={() =>
                                handleVariantChange(variants[0].id, "condition", condition)
                              }
                              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
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
                          className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
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
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="e.g. Slight scratch on the buckle"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="price"
                            className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
                          >
                            Price (IDR) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              Rp
                            </span>
                            <input
                              type="text"
                              id="price"
                              value={formatPrice(variants[0].price)}
                              onChange={(e) => handlePriceChange(variants[0].id, e.target.value)}
                              placeholder="0"
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="stock"
                            className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
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
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {variants.length > 0 && variants[0] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    placeholder="Describe your item in detail..."
                    maxLength={10000}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  />
                  {formData.description.length > 9500 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      {10000 - formData.description.length} characters remaining
                    </p>
                  )}
                </div>

                {variants.length > 0 && variants[0] && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Shipping Details (Optional)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label
                          htmlFor="weight"
                          className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
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
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="length"
                          className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
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
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="width"
                          className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
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
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="height"
                          className="block text-xs text-gray-500 dark:text-gray-400 mb-1"
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
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                  <label
                    htmlFor="isPreloved"
                    className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                  >
                    This is a pre-loved item
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSaving || !formData.name}
                  className="w-full bg-sky-600 dark:bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
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

