'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1" style={{ overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
