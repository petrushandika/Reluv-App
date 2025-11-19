'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/shared/components/organisms/Navbar';
import Footer from '@/shared/components/organisms/Footer';
import AppInitializer from '@/shared/components/organisms/AppInitializer';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
  const isDashboardPage = pathname.startsWith('/dashboard');

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AppInitializer>
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                style: {
                  borderRadius: '8px',
                },
                classNames: {
                  toast: 'p-4',
                  title: 'text-base',
                  description: 'text-sm',
                  success: 'bg-sky-600 border-sky-700 text-white',
                },
              }}
            />
            <div className="relative flex min-h-screen flex-col">
              {!isAuthPage && !isDashboardPage && <Navbar />}
              <main className={`flex-1 ${isAuthPage || isDashboardPage ? '' : 'pt-20 md:pt-24'}`}>
                {children}
              </main>
              {!isAuthPage && !isDashboardPage && <Footer />}
            </div>
          </AppInitializer>
        </AuthProvider>
      </body>
    </html>
  );
}
