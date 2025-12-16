"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/shared/store/theme.store";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    toggleTheme();
  };

  if (!mounted) {
    return (
      <div className="relative p-2 rounded-full">
        <div className="w-6 h-6" />
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      className="relative rounded-full transition-colors cursor-pointer"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 text-sky-600 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors" />
      ) : (
        <Moon className="w-6 h-6 text-sky-600 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors" />
      )}
    </button>
  );
}
