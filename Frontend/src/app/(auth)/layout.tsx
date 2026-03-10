import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Reluv App',
  description: 'Sign in to your Reluv account to manage your profile, orders, and wishlist.',
  robots: {
    index: false,
    follow: false,
  },
};

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
