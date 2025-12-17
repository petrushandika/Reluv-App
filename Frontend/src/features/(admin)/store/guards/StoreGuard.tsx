"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/features/(auth)/store/auth.store";

interface StoreGuardProps {
  children: React.ReactNode;
}

export function StoreGuard({ children }: StoreGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, status, isHydrated } = useAuthStore();
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStore = async () => {
      if (!isHydrated) return;

      if (!user) {
        router.push("/login");
        return;
      }

      if (pathname === "/store/create") {
        setHasStore(false);
        setChecking(false);
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
  }, [user, isHydrated, router, pathname]);

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

  if (!hasStore && pathname === "/store/create") {
    return <>{children}</>;
  }

  if (!hasStore) {
    return null;
  }

  return <>{children}</>;
}
