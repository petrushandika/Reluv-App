"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCartStore } from "../store/cart.store";
import { AddToCartPayload, UpdateCartItemPayload } from "../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCart = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);

  const cart = useCartStore((state) => state.cart);
  const isFetchingCart = useCartStore((state) => state.isLoading);
  const itemCount = useCartStore((state) => state.itemCount);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const addItem = useCartStore((state) => state.addItem);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      clearCart();
    }
  }, [isAuthenticated, fetchCart, clearCart]);

  const subtotal = useMemo(() => {
    return (
      cart?.items.reduce(
        (acc, item) => acc + item.variant.price * item.quantity,
        0
      ) || 0
    );
  }, [cart]);

  const handleAddItem = async (data: AddToCartPayload) => {
    if (!isAuthenticated()) {
      toast.error("Sign In Required", {
        description: "You must sign in to add items to your cart.",
      });
      router.push("/auth/login");
      return;
    }

    setIsAdding(true);
    const toastId = toast.loading("Adding to Cart", {
      description: "Please wait...",
    });
    try {
      await addItem(data);
      toast.success("Item Added", {
        description: "Item has been added to your cart successfully!",
        id: toastId,
      });
    } catch (error) {
      console.error("Failed to add item:", error);
      toast.error("Failed to Add Item", {
        description: "Unable to add item to cart. Please try again.",
        id: toastId,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateQuantity = async (
    itemId: number,
    data: UpdateCartItemPayload
  ) => {
    setIsUpdating(itemId);
    const toastId = toast.loading("Updating Quantity", {
      description: "Please wait...",
    });
    try {
      await updateItemQuantity(itemId, data);
      toast.success("Quantity Updated", {
        description: "Cart quantity has been updated successfully!",
        id: toastId,
      });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to Update Quantity", {
        description: "Unable to update quantity. Please try again.",
        id: toastId,
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setIsRemoving(itemId);
    const toastId = toast.loading("Removing Item", {
      description: "Please wait...",
    });
    try {
      await removeItem(itemId);
      toast.success("Item Removed", {
        description: "Item has been removed from your cart.",
        id: toastId,
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to Remove Item", {
        description: "Unable to remove item. Please try again.",
        id: toastId,
      });
    } finally {
      setIsRemoving(null);
    }
  };

  return {
    cart,
    isFetchingCart,
    itemCount,
    subtotal,
    addItem: handleAddItem,
    isAdding: isAdding,
    updateItemQuantity: handleUpdateQuantity,
    isUpdating,
    removeItem: handleRemoveItem,
    isRemoving,
  };
};
