"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/(auth)/store/auth.store";

interface StoreGuardProps {
  children: React.ReactNode;
}

export function StoreGuard({ children }: StoreGuardProps) {
  const router = useRouter();
  const { user, status, isHydrated } = useAuthStore();
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStore = async () => {
      // Wait for hydration
      if (!isHydrated) return;

      // Check if user is authenticated
      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        const token = useAuthStore.getState().token;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/me/my-store`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setHasStore(true);
        } else if (response.status === 404) {
          setHasStore(false);
          router.push("/store/create");
        }
      } catch (error) {
        console.error("Error checking store:", error);
        setHasStore(false);
        router.push("/store/create");
      } finally {
        setChecking(false);
      }
    };

    checkStore();
  }, [user, isHydrated, router]);

  if (!isHydrated || checking || hasStore === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!hasStore) {
    return null;
  }

  return <>{children}</>;
}
