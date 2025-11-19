"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import Spinner from "@/shared/components/atoms/Spinner";

const CallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      const previousPage = localStorage.getItem("previousPage") || "/";

      setToken(token)
        .then(() => {
          localStorage.removeItem("previousPage");
          router.push(previousPage);
        })
        .catch((error) => {
          console.error("Failed to authenticate:", error);
          router.push("/auth/login?error=authentication_failed");
        });
    } else {
      router.push("/auth/login?error=no_token");
    }
  }, [searchParams, setToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
