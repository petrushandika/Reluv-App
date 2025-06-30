"use client";

import { PublicRoute } from "@/shared/components/guards/RouteGuards";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoute>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </PublicRoute>
  );
}
