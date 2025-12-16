"use client";

import { ReactNode } from "react";

interface StoreHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode; // For actions/buttons
}

export default function StoreHeader({ title, description, children }: StoreHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}
