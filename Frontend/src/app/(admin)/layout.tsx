import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Reluv App',
  description: 'Manage your Reluv App store, products, orders, and analytics.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
