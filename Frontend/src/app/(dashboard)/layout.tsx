import { redirect } from "next/navigation";
import React from "react";

async function getSession() {
  // Simulasikan user login
  return {
    user: {
      name: "Admin",
      role: "admin",
    },
  };
}

function DashboardSidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <a href="/dashboard/overview" className="hover:underline">
            Overview
          </a>
        </li>
        <li>
          <a href="/dashboard/products" className="hover:underline">
            Products
          </a>
        </li>
        <li>
          <a href="/dashboard/orders" className="hover:underline">
            Orders
          </a>
        </li>
        <li>
          <a href="/dashboard/settings" className="hover:underline">
            Settings
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 bg-gray-100 p-8">{children}</main>
    </div>
  );
}
