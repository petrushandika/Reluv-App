"use client";

import { PrivateRoute } from "@/shared/components/guards/RouteGuards";
import Sidebar from "@/shared/components/organisms/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <div className="h-screen overflow-hidden flex">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </PrivateRoute>
  );
}
