"use client";

import { PublicRoute } from "@/shared/components/guards/RouteGuards";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">{children}</div>
      </div>
    </PublicRoute>
  );
}
