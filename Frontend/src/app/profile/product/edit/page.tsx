"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";
import Spinner from "@/shared/components/atoms/Spinner";
import {
  getProductById,
  updateProduct,
  updateProductVariant,
  deleteProductVariant,
} from "@/features/products/api/productsApi";
import { Product, Variant, Condition } from "@/features/products/types";
import { toast } from "sonner";
import Image from "next/image";

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
  });
  const [variants, setVariants] = useState<Variant[]>([]);
  const [editingVariant, setEditingVariant] = useState<number | null>(null);

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
        });
        setVariants(productData.variants || []);
      } catch (error: any) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to Load Product", {
          description: error.message || "Unable to load product.",
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
      await updateProduct(product.id, {
        name: formData.name,
        description: formData.description,
        images: formData.images,
      });
      toast.success("Product Updated", {
        description: "Product details have been updated successfully.",
      });
      router.push("/profile/product");
    } catch (error: any) {
      toast.error("Failed to Update Product", {
        description: error.message || "Unable to update product.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveVariant = async (variant: Variant) => {
    if (!product) return;

    try {
      setIsSaving(true);
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
      toast.success("Variant Updated", {
        description: "Product variant has been updated successfully.",
      });
      setEditingVariant(null);
      // Refresh product data
      const updatedProduct = await getProductById(product.id);
      setVariants(updatedProduct.variants || []);
    } catch (error: any) {
      toast.error("Failed to Update Variant", {
        description: error.message || "Unable to update variant.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVariant = async (variantId: number) => {
    if (!product) return;

    if (
      !confirm(
        "Are you sure you want to delete this variant? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsSaving(true);
      await deleteProductVariant(product.id, variantId);
      toast.success("Variant Deleted", {
        description: "Variant has been deleted successfully.",
      });
      // Refresh product data
      const updatedProduct = await getProductById(product.id);
      setVariants(updatedProduct.variants || []);
    } catch (error: any) {
      toast.error("Failed to Delete Variant", {
        description: error.message || "Unable to delete variant.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleVariantChange = (
    variantId: number,
    field: keyof Variant,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!product) {
    return null;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="mb-6">
            <button
              onClick={() => router.push("/profile/product")}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Edit Product
              </h1>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-6">
              Product Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent resize-none"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Product Images
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            images: formData.images.filter((_, i) => i !== index),
                          });
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {formData.images.length} image(s)
                </p>
              </div>

              <button
                onClick={handleSaveProduct}
                disabled={isSaving || !formData.name}
                className="w-full sm:w-auto px-6 py-2.5 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Product Details"}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Product Variants
              </h2>
            </div>

            <div className="space-y-6">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      Variant {variant.id}
                      {variant.sku && (
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                          (SKU: {variant.sku})
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2">
                      {editingVariant === variant.id ? (
                        <>
                          <button
                            onClick={() => handleSaveVariant(variant)}
                            disabled={isSaving}
                            className="px-3 py-1.5 bg-sky-600 dark:bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={async () => {
                              setEditingVariant(null);
                              // Reset variant data
                              try {
                                const updatedProduct = await getProductById(product.id);
                                setVariants(updatedProduct.variants || []);
                              } catch (error) {
                                console.error("Failed to refresh variant data:", error);
                              }
                            }}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingVariant(variant.id)}
                            className="px-3 py-1.5 bg-sky-600 dark:bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVariant(variant.id)}
                            disabled={isSaving}
                            className="px-3 py-1.5 bg-red-600 dark:bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingVariant === variant.id ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Size
                        </label>
                        <input
                          type="text"
                          value={variant.size || ""}
                          onChange={(e) =>
                            handleVariantChange(variant.id, "size", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
                          placeholder="Size"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Color
                        </label>
                        <input
                          type="text"
                          value={variant.color || ""}
                          onChange={(e) =>
                            handleVariantChange(variant.id, "color", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
                          placeholder="Color"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Price
                        </label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "price",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
                          placeholder="Price"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Compare At Price
                        </label>
                        <input
                          type="number"
                          value={variant.compareAtPrice || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "compareAtPrice",
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
                          placeholder="Compare at price"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "stock",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
                          placeholder="Stock"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Condition
                        </label>
                        <select
                          value={variant.condition}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "condition",
                              e.target.value as Condition
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent cursor-pointer"
                        >
                          <option value="NEW">New</option>
                          <option value="LIKE_NEW">Like New</option>
                          <option value="GOOD">Good</option>
                          <option value="FAIR">Fair</option>
                          <option value="POOR">Poor</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Condition Note
                        </label>
                        <textarea
                          value={variant.conditionNote || ""}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "conditionNote",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent resize-none"
                          placeholder="Condition note"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Weight (grams)
                        </label>
                        <input
                          type="number"
                          value={variant.weight}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "weight",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
                          placeholder="Weight"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Length (cm)
                        </label>
                        <input
                          type="number"
                          value={variant.length}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "length",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
                          placeholder="Length"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Width (cm)
                        </label>
                        <input
                          type="number"
                          value={variant.width}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "width",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
                          placeholder="Width"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          value={variant.height}
                          onChange={(e) =>
                            handleVariantChange(
                              variant.id,
                              "height",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
                          placeholder="Height"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Size</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {variant.size || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Color</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {variant.color || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Price</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatPrice(variant.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Stock</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {variant.stock}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Condition</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {variant.condition}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Weight</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {variant.weight}g
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Dimensions</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {variant.length} × {variant.width} × {variant.height} cm
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {variants.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No variants found
              </p>
            )}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default EditProductPage;

