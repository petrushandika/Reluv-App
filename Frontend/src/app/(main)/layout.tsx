'use client';

import Navbar from '@/shared/components/layout/Navbar';
import Footer from '@/shared/components/layout/Footer';
import BackToTop from '@/shared/components/layout/BackToTop';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main
        className="flex-1 pt-20 md:pt-24 lg:pt-36"
        style={{ overflowY: 'auto' }}
      >
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
