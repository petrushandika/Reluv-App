"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useWishlistStore } from "../store/wishlist.store";
import { AddToWishlist, RemoveFromWishlist } from "../types";
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
    return new Set(items.map((item) => item.productId || item.product?.id));
  }, [items]);

  const handleAddItem = async (data: AddToWishlist) => {
    if (!isAuthenticated()) {
      toast.error("Please sign in", {
        description: "You must sign in to add items to your wishlist.",
      });
      router.push("/auth/login");
      return;
    }

    const toastId = toast.loading("Adding to wishlist...");
    try {
      await addItem(data);
      toast.success("Item added to wishlist!", { id: toastId });
    } catch (error) {
      console.error("Failed to add item to wishlist:", error);
      toast.error("Failed to add item", { id: toastId });
    }
  };

  const handleRemoveItem = async (data: RemoveFromWishlist) => {
    const toastId = toast.loading("Removing from wishlist...");
    try {
      await removeItem(data);
      toast.success("Item removed from wishlist", { id: toastId });
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
      toast.error("Failed to remove item", { id: toastId });
    }
  };

  const isInWishlist = useCallback(
    (data: AddToWishlist) => {
      return wishlistProductIds.has(data.productId);
    },
    [wishlistProductIds]
  );

  return {
    wishlistItems: items,
    isLoading,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    isInWishlist,
  };
};
