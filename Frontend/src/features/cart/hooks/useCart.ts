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
      toast.error("Silakan masuk", {
        description: "Anda harus masuk untuk menambahkan item ke keranjang.",
      });
      router.push("/auth/login");
      return;
    }

    setIsAdding(true);
    const toastId = toast.loading("Menambahkan item ke keranjang...");
    try {
      await addItem(data);
      toast.success("Item ditambahkan ke keranjang!", { id: toastId });
    } catch (error) {
      console.error("Gagal menambah item:", error);
      toast.error("Gagal menambahkan item", { id: toastId });
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateQuantity = async (
    itemId: number,
    data: UpdateCartItemPayload
  ) => {
    setIsUpdating(itemId);
    const toastId = toast.loading("Memperbarui kuantitas...");
    try {
      await updateItemQuantity(itemId, data);
      toast.success("Kuantitas diperbarui", { id: toastId });
    } catch (error) {
      console.error("Gagal memperbarui kuantitas:", error);
      toast.error("Gagal memperbarui kuantitas", { id: toastId });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setIsRemoving(itemId);
    const toastId = toast.loading("Menghapus item...");
    try {
      await removeItem(itemId);
      toast.success("Item dihapus dari keranjang", { id: toastId });
    } catch (error) {
      console.error("Gagal menghapus item:", error);
      toast.error("Gagal menghapus item", { id: toastId });
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
