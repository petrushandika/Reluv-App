"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useThemeStore } from "@/shared/store/theme.store";
import { useEffect } from "react";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isHydrated, isAuthenticated, fetchAndSetUser } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    // Initialize theme on mount
    if (typeof window !== "undefined") {
      initializeTheme();
    }
  }, [initializeTheme]);

  useEffect(() => {
    if (isHydrated && isAuthenticated()) {
      fetchAndSetUser();
    }
  }, [isHydrated, isAuthenticated, fetchAndSetUser]);

  useEffect(() => {
    // Apply theme on mount and when theme changes
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  return <>{children}</>;
};

export default AppInitializer;
