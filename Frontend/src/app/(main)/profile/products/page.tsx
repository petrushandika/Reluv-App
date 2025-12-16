"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Package,
  ChevronLeft,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { getMe } from "@/features/(main)/user/api/userApi";
import { User as UserType } from "@/features/(auth)/types";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";
import ProfileSidebar from "@/shared/components/layout/ProfileSidebar";
import Spinner from "@/shared/components/common/Spinner";
import {
  getMyProducts,
  deleteProduct,
  updateProductPrice,
  updateProductStock,
  toggleProductStatus,
} from "@/features/(main)/products/api/productsApi";
import { Product, Variant } from "@/features/(main)/products/types";
import { toast } from "sonner";
import Image from "next/image";

const priceSchema = z
  .string()
  .min(1, { message: "Price is required" })
  .refine(
    (val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0 && num <= 999999999;
    },
    { message: "Price must be between 0 and 999,999,999" }
  );

const stockSchema = z
  .string()
  .min(1, { message: "Stock is required" })
  .refine(
    (val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 0 && num <= 999999;
    },
    { message: "Stock must be between 0 and 999,999" }
  );

const ChangePriceModal = ({
  isOpen,
  onClose,
  onConfirm,
  currentPrice,
  variant,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (price: number) => Promise<void>;
  currentPrice: number;
  variant: Variant;
}) => {
  const [price, setPrice] = useState(currentPrice.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPrice(currentPrice.toString());
      setPriceError(null);
    }
  }, [isOpen, currentPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setPriceError(null);

    const validation = priceSchema.safeParse(price);
    if (!validation.success) {
      setPriceError(validation.error.errors[0]?.message || "Invalid price");
      toast.error("Validation Failed", {
        description: "Please fix the price before submitting.",
      });
      return;
    }

    const priceNum = parseInt(price, 10);

    setIsSubmitting(true);
    try {
      await onConfirm(priceNum);
      onClose();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Change Price
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Variant: {variant.size || "N/A"} / {variant.color || "N/A"}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                New Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (priceError) {
                    setPriceError(null);
                  }
                }}
                min="0"
                required
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent ${
                  priceError
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter new price"
              />
              {priceError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {priceError}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-sky-600 dark:bg-sky-500 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ChangeStockModal = ({
  isOpen,
  onClose,
  onConfirm,
  currentStock,
  variant,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (stock: number) => Promise<void>;
  currentStock: number;
  variant: Variant;
}) => {
  const [stock, setStock] = useState(currentStock.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStock(currentStock.toString());
      setStockError(null);
    }
  }, [isOpen, currentStock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStockError(null);

    const validation = stockSchema.safeParse(stock);
    if (!validation.success) {
      setStockError(validation.error.errors[0]?.message || "Invalid stock");
      toast.error("Validation Failed", {
        description: "Please fix the stock before submitting.",
      });
      return;
    }

    const stockNum = parseInt(stock, 10);

    setIsSubmitting(true);
    try {
      await onConfirm(stockNum);
      onClose();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Change Stock
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Variant: {variant.size || "N/A"} / {variant.color || "N/A"}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                New Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value);
                  if (stockError) {
                    setStockError(null);
                  }
                }}
                min="0"
                required
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent ${
                  stockError
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter new stock"
              />
              {stockError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {stockError}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-sky-600 dark:bg-sky-500 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DeleteProductModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  productName: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      setIsSubmitting(true);
      try {
        await onConfirm();
        onClose();
      } catch {
      } finally {
        setIsSubmitting(false);
      }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Delete Product
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete &quot;{productName}&quot;? This action cannot
            be undone.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BulkDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  productCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  productCount: number;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Delete Products
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete {productCount} product{productCount !== 1 ? "s" : ""}? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleStatusModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
  isActive,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  productName: string;
  isActive: boolean;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      setIsSubmitting(true);
      try {
        await onConfirm();
        onClose();
      } catch {
      } finally {
        setIsSubmitting(false);
      }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {isActive ? "Deactivate Product" : "Activate Product"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to {isActive ? "deactivate" : "activate"} &quot;{productName}&quot;?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-sky-600 dark:bg-sky-500 text-white rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Processing..." : isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest" | "oldest">("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [changePriceModal, setChangePriceModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    variant: Variant | null;
  }>({ isOpen: false, product: null, variant: null });
  const [changeStockModal, setChangeStockModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    variant: Variant | null;
  }>({ isOpen: false, product: null, variant: null });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });
  const [toggleStatusModal, setToggleStatusModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });
  const [bulkDeleteModal, setBulkDeleteModal] = useState<{
    isOpen: boolean;
  }>({ isOpen: false });

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated()) return;

      try {
        setIsLoadingProducts(true);
        const productList = await getMyProducts();
        setProducts(productList);
      } catch (error) {
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (isAuthenticated()) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.sort-dropdown-container')) {
        setIsSortDropdownOpen(false);
      }
    };

    if (isSortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortDropdownOpen]);

  const handleToggleSelect = (productId: number) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const filteredProducts = getFilteredProducts();
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const handleChangePrice = async (price: number) => {
    if (!changePriceModal.product || !changePriceModal.variant) return;

    try {
      await updateProductPrice(
        changePriceModal.product.id,
        changePriceModal.variant.id,
        price
      );
      toast.success("Price Updated", {
        description: "Product price has been updated successfully.",
      });
      const productList = await getMyProducts();
      setProducts(productList);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unable to update product price.";
        toast.error("Failed to Update Price", {
          description: errorMessage,
        });
        throw error;
      }
  };

  const handleChangeStock = async (stock: number) => {
    if (!changeStockModal.product || !changeStockModal.variant) return;

    try {
      await updateProductStock(
        changeStockModal.product.id,
        changeStockModal.variant.id,
        stock
      );
      toast.success("Stock Updated", {
        description: "Product stock has been updated successfully.",
      });
      const productList = await getMyProducts();
      setProducts(productList);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unable to update product stock.";
        toast.error("Failed to Update Stock", {
          description: errorMessage,
        });
        throw error;
      }
  };

  const handleDeleteProduct = async () => {
    if (!deleteModal.product) return;

    try {
      await deleteProduct(deleteModal.product.id);
      toast.success("Product Deleted", {
        description: "Product has been deleted successfully.",
      });
      setProducts(products.filter((p) => p.id !== deleteModal.product!.id));
      setDeleteModal({ isOpen: false, product: null });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unable to delete product.";
        toast.error("Failed to Delete Product", {
          description: errorMessage,
        });
        throw error;
      }
  };

  const handleToggleProductStatus = async (product: Product) => {
    try {
      await toggleProductStatus(product.id, !product.isActive);
      toast.success(
        product.isActive ? "Product Deactivated" : "Product Activated",
        {
          description: `Product has been ${
            product.isActive ? "deactivated" : "activated"
          } successfully.`,
        }
      );
      const productList = await getMyProducts();
      setProducts(productList);
      setToggleStatusModal({ isOpen: false, product: null });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unable to update product status.";
        toast.error("Failed to Update Status", {
          description: errorMessage,
        });
      }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;

    try {
      const deletePromises = Array.from(selectedProducts).map((id) =>
        deleteProduct(id)
      );
      await Promise.all(deletePromises);
      toast.success("Products Deleted", {
        description: `${selectedProducts.size} product(s) have been deleted successfully.`,
      });
      setProducts(products.filter((p) => !selectedProducts.has(p.id)));
      setSelectedProducts(new Set());
      setBulkDeleteModal({ isOpen: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unable to delete products.";
        toast.error("Failed to Delete Products", {
          description: errorMessage,
        });
        throw error;
      }
  };

  const getFilteredProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === "active") {
      filtered = filtered.filter((p) => p.isActive);
    } else if (filterStatus === "inactive") {
      filtered = filtered.filter((p) => !p.isActive);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0);
        case "price_desc":
          return (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0);
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredProducts = getFilteredProducts();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  };

  if (isLoading || isLoadingProducts) {
    return <Spinner />;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  My Product
                </h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-6 lg:pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    My Product
                  </h1>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
                  <div className="mb-8 flex items-center justify-center">
                    <Package className="w-24 h-24 sm:w-32 sm:h-32 text-sky-600 dark:text-sky-400 stroke-[1.5]" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No products yet
                  </h2>

                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center mb-8 max-w-md">
                    Start selling by adding your first product.
                  </p>

                  <button
                    onClick={() => router.push("/sell")}
                    className="px-6 py-3 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Product
                  </button>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <div className="flex gap-4 sm:gap-6 min-w-max">
                      <button
                        onClick={() => setFilterStatus("all")}
                        className={`pb-3 px-2 sm:px-1 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                          filterStatus === "all"
                            ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilterStatus("active")}
                        className={`pb-3 px-2 sm:px-1 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                          filterStatus === "active"
                            ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => setFilterStatus("inactive")}
                        className={`pb-3 px-2 sm:px-1 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                          filterStatus === "inactive"
                            ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        Non Active
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:flex-1">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search Product"
                          className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm hover:shadow-md"
                        />
                      </div>

                      <div className="relative w-full sm:w-auto sort-dropdown-container">
                        <button
                          type="button"
                          onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                          className="w-full sm:min-w-[200px] flex items-center justify-between px-4 py-2.5 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm hover:shadow-md"
                        >
                          <span className="text-left">
                            {sortBy === "newest" && "Newest"}
                            {sortBy === "oldest" && "Oldest"}
                            {sortBy === "price_asc" && "Price: Low to High"}
                            {sortBy === "price_desc" && "Price: High to Low"}
                            {sortBy === "name_asc" && "Name: A to Z"}
                            {sortBy === "name_desc" && "Name: Z to A"}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 dark:text-gray-500 ml-2 shrink-0 transition-transform duration-200 ${
                              isSortDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isSortDropdownOpen && (
                          <div className="absolute z-50 w-full sm:min-w-[200px] mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
                            <div className="py-1">
                              {[
                                { value: "newest", label: "Newest" },
                                { value: "oldest", label: "Oldest" },
                                { value: "price_asc", label: "Price: Low to High" },
                                { value: "price_desc", label: "Price: High to Low" },
                                { value: "name_asc", label: "Name: A to Z" },
                                { value: "name_desc", label: "Name: Z to A" },
                              ].map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    setSortBy(
                                      option.value as "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest" | "oldest"
                                    );
                                    setIsSortDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm sm:text-base transition-colors ${
                                    sortBy === option.value
                                      ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-medium"
                                      : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => router.push("/sell")}
                      className="px-4 py-2.5 sm:py-2 bg-sky-600 dark:bg-sky-500 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add Product
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {filteredProducts.length} product
                      {filteredProducts.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      {selectedProducts.size > 0 && (
                        <button
                          onClick={() => {
                            setBulkDeleteModal({ isOpen: true });
                          }}
                          className="px-3 py-1.5 border border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 text-xs font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer flex-1 sm:flex-none"
                        >
                          Delete Product
                        </button>
                      )}
                      <label className="flex items-center gap-2 cursor-pointer flex-1 sm:flex-none justify-end sm:justify-start">
                        <input
                          type="checkbox"
                          checked={
                            filteredProducts.length > 0 &&
                            selectedProducts.size === filteredProducts.length
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-sky-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 dark:focus:ring-sky-400"
                        />
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Select All
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 md:p-6"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <div className="relative w-full h-48 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0 w-full sm:w-auto">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white flex-1 line-clamp-2 sm:truncate">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-2 sm:hidden shrink-0">
                                <input
                                  type="checkbox"
                                  checked={selectedProducts.has(product.id)}
                                  onChange={() => handleToggleSelect(product.id)}
                                  className="w-4 h-4 text-sky-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 dark:focus:ring-sky-400 cursor-pointer"
                                />
                                <button
                                  onClick={() => setToggleStatusModal({ isOpen: true, product })}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                                    product.isActive
                                      ? "bg-sky-600 dark:bg-sky-500"
                                      : "bg-gray-300 dark:bg-gray-600"
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      product.isActive
                                        ? "translate-x-5"
                                        : "translate-x-1"
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-xs sm:text-sm mb-3">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500 dark:text-gray-400">Price:</span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                  {formatPrice(product.variants[0]?.price || 0)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500 dark:text-gray-400">Stock:</span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                  {getTotalStock(product)}
                                </span>
                              </div>
                              {product.variants.length > 0 && (
                                <div className="w-full sm:w-auto flex items-center gap-1">
                                  <span className="text-gray-500 dark:text-gray-400">Variants:</span>
                                  <span className="text-gray-900 dark:text-white font-medium text-xs sm:text-sm">
                                    {product.variants.map((v, idx) => (
                                      <span key={v.id}>
                                        {v.size || "N/A"} / {v.color || "N/A"}
                                        {idx < product.variants.length - 1 && ", "}
                                      </span>
                                    ))}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1.5 sm:gap-1.5">
                              {product.variants.map((variant) => (
                                <React.Fragment key={variant.id}>
                                  <button
                                    onClick={() =>
                                      setChangePriceModal({
                                        isOpen: true,
                                        product,
                                        variant,
                                      })
                                    }
                                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                  >
                                    Change Price
                                  </button>
                                  <button
                                    onClick={() =>
                                      setChangeStockModal({
                                        isOpen: true,
                                        product,
                                        variant,
                                      })
                                    }
                                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                  >
                                    Change Stock
                                  </button>
                                </React.Fragment>
                              ))}
                              <button
                                onClick={() =>
                                  router.push(`/profile/products/edit?id=${product.id}`)
                                }
                                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                              >
                                Edit Product
                              </button>
                              <button
                                onClick={() => setDeleteModal({ isOpen: true, product })}
                                className="px-2 py-1 text-xs border border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                              >
                                Delete Product
                              </button>
                            </div>
                          </div>

                          <div className="hidden sm:flex flex-col items-center justify-between min-h-[120px] shrink-0">
                            <input
                              type="checkbox"
                              checked={selectedProducts.has(product.id)}
                              onChange={() => handleToggleSelect(product.id)}
                              className="w-4 h-4 text-sky-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 dark:focus:ring-sky-400 cursor-pointer"
                            />
                            <button
                              onClick={() => setToggleStatusModal({ isOpen: true, product })}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                                product.isActive
                                  ? "bg-sky-600 dark:bg-sky-500"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  product.isActive
                                    ? "translate-x-5"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>

        <ChangePriceModal
          isOpen={changePriceModal.isOpen}
          onClose={() =>
            setChangePriceModal({ isOpen: false, product: null, variant: null })
          }
          onConfirm={handleChangePrice}
          currentPrice={changePriceModal.variant?.price || 0}
          variant={changePriceModal.variant!}
        />

        <ChangeStockModal
          isOpen={changeStockModal.isOpen}
          onClose={() =>
            setChangeStockModal({ isOpen: false, product: null, variant: null })
          }
          onConfirm={handleChangeStock}
          currentStock={changeStockModal.variant?.stock || 0}
          variant={changeStockModal.variant!}
        />

        <DeleteProductModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, product: null })}
          onConfirm={handleDeleteProduct}
          productName={deleteModal.product?.name || ""}
        />

        <ToggleStatusModal
          isOpen={toggleStatusModal.isOpen}
          onClose={() => setToggleStatusModal({ isOpen: false, product: null })}
          onConfirm={() => {
            if (toggleStatusModal.product) {
              return handleToggleProductStatus(toggleStatusModal.product);
            }
            return Promise.resolve();
          }}
          productName={toggleStatusModal.product?.name || ""}
          isActive={toggleStatusModal.product?.isActive || false}
        />
        <BulkDeleteModal
          isOpen={bulkDeleteModal.isOpen}
          onClose={() => setBulkDeleteModal({ isOpen: false })}
          onConfirm={handleBulkDelete}
          productCount={selectedProducts.size}
        />
      </div>
    </PrivateRoute>
  );
};

export default ProductPage;



