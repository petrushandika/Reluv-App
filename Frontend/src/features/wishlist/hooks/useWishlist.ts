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
    console.log(
      "[Wishlist Hook] useEffect triggered, isAuthenticated:",
      isAuthenticated()
    );
    if (isAuthenticated()) {
      console.log("[Wishlist Hook] Fetching wishlist...");
      fetchWishlist();
    } else {
      console.log("[Wishlist Hook] Not authenticated, clearing wishlist");
      clearWishlist();
    }
  }, [isAuthenticated, fetchWishlist, clearWishlist]);

  const wishlistProductIds = useMemo(() => {
    const ids = new Set(
      items.map((item) => item.productId || item.product?.id)
    );
    console.log("[Wishlist Hook] wishlistProductIds updated:", Array.from(ids));
    return ids;
  }, [items]);

  const handleAddItem = async (data: AddToWishlist) => {
    console.log("[Wishlist Hook] handleAddItem called with:", data);
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
      console.log("[Wishlist Hook] handleAddItem success");
      toast.success("Item added to wishlist!", { id: toastId });
    } catch (error) {
      console.error("[Wishlist Hook] Failed to add item to wishlist:", error);
      toast.error("Failed to add item", { id: toastId });
    }
  };

  const handleRemoveItem = async (data: RemoveFromWishlist) => {
    console.log("[Wishlist Hook] handleRemoveItem called with:", data);
    const toastId = toast.loading("Removing from wishlist...");
    try {
      await removeItem(data);
      console.log("[Wishlist Hook] handleRemoveItem success");
      toast.success("Item removed from wishlist", { id: toastId });
    } catch (error) {
      console.error(
        "[Wishlist Hook] Failed to remove item from wishlist:",
        error
      );
      toast.error("Failed to remove item", { id: toastId });
    }
  };

  const isInWishlist = useCallback(
    (data: AddToWishlist) => {
      const result = wishlistProductIds.has(data.productId);
      console.log(
        "[Wishlist Hook] isInWishlist check:",
        data.productId,
        "->",
        result
      );
      return result;
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
