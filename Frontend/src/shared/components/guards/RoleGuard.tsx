"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import Spinner from "@/shared/components/common/Spinner";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ("USER" | "STORE" | "ADMIN")[];
  redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
  const router = useRouter();
  const { user, isHydrated, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated() || !user) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      // Redirect based on user's actual role
      switch (user.role) {
        case "STORE":
          router.push(redirectTo || "/store");
          break;
        case "ADMIN":
          router.push(redirectTo || "/superadmin");
          break;
        case "USER":
        default:
          router.push(redirectTo || "/");
          break;
      }
    }
  }, [user, isHydrated, isAuthenticated, router, allowedRoles, redirectTo]);

  if (!isHydrated) {
    return <Spinner />;
  }

  if (!isAuthenticated() || !user || !allowedRoles.includes(user.role)) {
    return <Spinner />;
  }

  return <>{children}</>;
}
