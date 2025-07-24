"use client";

import { useEffect, useMemo } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useWishlistStore } from "../store/wishlist.store";
import { AddToWishlistPayload } from "../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useWishlist = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const items = useWishlistStore((state) => state.items);
  const isLoading = useWishlistStore((state) => state.isLoading);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchWishlist();
    } else {
      clearWishlist();
    }
  }, [isAuthenticated, fetchWishlist, clearWishlist]);

  const wishlistProductIds = useMemo(() => {
    return new Set(items.map((item) => item.productId));
  }, [items]);

  const handleAddItem = async (data: AddToWishlistPayload) => {
    if (!isAuthenticated()) {
      toast.error("Silakan masuk", {
        description: "Anda harus masuk untuk menambahkan item ke wishlist.",
      });
      router.push("/auth/login");
      return;
    }

    const toastId = toast.loading("Menambahkan ke wishlist...");
    try {
      await addItem(data);
      toast.success("Item ditambahkan ke wishlist!", { id: toastId });
    } catch (error) {
      console.error("Gagal menambahkan item ke wishlist:", error);
      toast.error("Gagal menambahkan item", { id: toastId });
    }
  };

  const handleRemoveItem = async (productId: number) => {
    const toastId = toast.loading("Menghapus dari wishlist...");
    try {
      await removeItem(productId);
      toast.success("Item dihapus dari wishlist", { id: toastId });
    } catch (error) {
      console.error("Gagal menghapus item dari wishlist:", error);
      toast.error("Gagal menghapus item", { id: toastId });
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistProductIds.has(productId);
  };

  return {
    wishlistItems: items,
    isLoading,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    isInWishlist,
  };
};
