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
import BackToTop from '@/shared/components/organisms/BackToTop';

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const themeStorage = localStorage.getItem('theme-storage');
                  
                  // Always start with light mode (remove dark class)
                  root.classList.remove('dark');
                  
                  // If there's stored theme, apply it
                  if (themeStorage) {
                    try {
                      const parsed = JSON.parse(themeStorage);
                      if (parsed && parsed.state && parsed.state.theme === 'dark') {
                        root.classList.add('dark');
                      } else {
                        // Ensure light mode if stored theme is not dark
                        root.classList.remove('dark');
                      }
                    } catch (e) {
                      // If parsing fails, clear storage and use light mode
                      localStorage.removeItem('theme-storage');
                      root.classList.remove('dark');
                    }
                  } else {
                    // No storage, ensure light mode
                    root.classList.remove('dark');
                  }
                } catch (e) {
                  // On any error, ensure light mode
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors`}
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
              <main
                className={`flex-1 ${
                  isAuthPage || isDashboardPage ? '' : 'pt-24 md:pt-28 lg:pt-44'
                }`}
              >
                {children}
              </main>
              {!isAuthPage && !isDashboardPage && <Footer />}
              {!isAuthPage && !isDashboardPage && <BackToTop />}
            </div>
          </AppInitializer>
        </AuthProvider>
      </body>
    </html>
  );
}
