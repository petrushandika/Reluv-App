'use client';

import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from '@/context/AuthContext';
import AppInitializer from '@/shared/components/layout/AppInitializer';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ overflowY: 'auto', height: 'auto', minHeight: '100vh' }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const themeStorage = localStorage.getItem('theme-storage');
                  
                  root.classList.remove('dark');
                  
                  if (themeStorage) {
                    try {
                      const parsed = JSON.parse(themeStorage);
                      if (parsed && parsed.state && parsed.state.theme === 'dark') {
                        root.classList.add('dark');
                      } else {
                        root.classList.remove('dark');
                      }
                    } catch (e) {
                      localStorage.removeItem('theme-storage');
                      root.classList.remove('dark');
                    }
                  } else {
                    root.classList.remove('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased transition-colors`}
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          overflowY: 'auto',
          height: 'auto',
          minHeight: '100vh',
        }}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AppInitializer>
            <Toaster
              position="bottom-right"
              richColors
              toastOptions={{
                style: {
                  borderRadius: '8px',
                },
                classNames: {
                  toast: 'p-4',
                  title: 'text-base font-semibold',
                  description: 'text-sm opacity-90',
                  success: 'bg-green-600 border-green-700 text-white',
                  error: 'bg-red-600 border-red-700 text-white',
                  warning: 'bg-yellow-500 border-yellow-600 text-white',
                  info: 'bg-blue-600 border-blue-700 text-white',
                },
              }}
            />
            {children}
          </AppInitializer>
        </AuthProvider>
      </body>
    </html>
  );
}
