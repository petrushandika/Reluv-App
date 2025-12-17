'use client';

import { RoleGuard } from '@/shared/components/guards/RoleGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["STORE", "ADMIN"]}>
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1" style={{ overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
