"use client";

import Navbar from "@/shared/components/organisms/Navbar";
import Footer from "@/shared/components/organisms/Footer";
import { PublicRoute } from "@/shared/components/guards/RouteGuards";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </PublicRoute>
  );
}
