"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
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
    if (!Array.isArray(items)) {
      return new Set();
    }
    return new Set(items.map((item) => item.productId || item.product?.id));
  }, [items]);

  const handleAddItem = async (data: AddToWishlist) => {
    if (!isAuthenticated()) {
      toast.error("Sign In Required", {
        description: "You must sign in to add items to your wishlist.",
      });
      router.push("/login");
      return;
    }

    const toastId = toast.loading("Adding to Wishlist", {
      description: "Please wait...",
    });
    try {
      await addItem(data);
      toast.success("Item Added", {
        description: "Item has been added to your wishlist successfully!",
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to Add Item", {
        description: "Unable to add item to wishlist. Please try again.",
        id: toastId,
      });
    }
  };

  const handleRemoveItem = async (data: RemoveFromWishlist) => {
    const toastId = toast.loading("Removing from Wishlist", {
      description: "Please wait...",
    });
    try {
      await removeItem(data);
      toast.success("Item Removed", {
        description: "Item has been removed from your wishlist.",
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to Remove Item", {
        description: "Unable to remove item from wishlist. Please try again.",
        id: toastId,
      });
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
