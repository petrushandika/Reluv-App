'use client';

import Navbar from '@/shared/components/layout/Navbar';
import Footer from '@/shared/components/layout/Footer';
import BackToTop from '@/shared/components/layout/BackToTop';
import { RoleGuard } from '@/shared/components/guards/RoleGuard';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["USER"]}>
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
    </RoleGuard>
  );
}
