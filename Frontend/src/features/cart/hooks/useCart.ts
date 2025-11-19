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
      toast.error("Please sign in", {
        description: "You must sign in to add items to your cart.",
      });
      router.push("/auth/login");
      return;
    }

    setIsAdding(true);
    const toastId = toast.loading("Adding item to cart...");
    try {
      await addItem(data);
      toast.success("Item added to cart!", { id: toastId });
    } catch (error) {
      console.error("Failed to add item:", error);
      toast.error("Failed to add item", { id: toastId });
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateQuantity = async (
    itemId: number,
    data: UpdateCartItemPayload
  ) => {
    setIsUpdating(itemId);
    const toastId = toast.loading("Updating quantity...");
    try {
      await updateItemQuantity(itemId, data);
      toast.success("Quantity updated", { id: toastId });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity", { id: toastId });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setIsRemoving(itemId);
    const toastId = toast.loading("Removing item...");
    try {
      await removeItem(itemId);
      toast.success("Item removed from cart", { id: toastId });
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item", { id: toastId });
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
