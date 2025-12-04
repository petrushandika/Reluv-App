"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";

        set({ theme: newTheme });

        if (typeof window !== "undefined") {
          const root = document.documentElement;
          if (newTheme === "dark") {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      },
      setTheme: (theme: Theme) => {
        if (typeof window !== "undefined") {
          const root = document.documentElement;
          if (theme === "dark") {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
        set({ theme });
      },
      initializeTheme: () => {
        if (typeof window !== "undefined") {
          const theme = get().theme;
          const root = document.documentElement;
          if (theme === "dark") {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state) => {
          if (typeof window !== "undefined") {
            const root = document.documentElement;
            if (state && state.theme === "dark") {
              root.classList.add("dark");
            } else {
              root.classList.remove("dark");
            }
          }
        };
      },
    }
  )
);
