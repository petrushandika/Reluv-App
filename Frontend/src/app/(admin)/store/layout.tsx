"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { StoreGuard } from "@/features/(admin)/store/guards/StoreGuard";
import StoreSidebar from "@/features/(admin)/store/components/StoreSidebar";

export default function StoreDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on the create page
  const isCreatePage = pathname === "/store/create";

  // If on create page, render without StoreGuard and sidebar
  if (isCreatePage) {
    return <>{children}</>;
  }

  // Otherwise, render with StoreGuard and sidebar
  return (
    <StoreGuard>
      <div className="h-screen overflow-hidden flex">
        <StoreSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">Store Dashboard</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </StoreGuard>
  );
}
