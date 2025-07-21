"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useEffect } from "react";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isHydrated, isAuthenticated, fetchAndSetUser } = useAuthStore();

  useEffect(() => {
    if (isHydrated && isAuthenticated()) {
      fetchAndSetUser();
    }
  }, [isHydrated, isAuthenticated, fetchAndSetUser]);

  return <>{children}</>;
};

export default AppInitializer;
