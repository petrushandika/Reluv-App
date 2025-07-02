"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/shared/components/organisms/Navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            {!isAuthPage && <Navbar />}

            <main className={`flex-1 ${isAuthPage ? "" : "pt-10 md:pt-20"}`}>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
