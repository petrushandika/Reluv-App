import type { Metadata } from 'next';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
  title: {
    default: 'Reluv App - Premium Thrift Store',
    template: '%s | Reluv App'
  },
  description: 'Discover premium thrifted fashion at Reluv. Shop securely, sell your pre-loved items, and join our sustainable fashion community.',
  keywords: ['thrift', 'fashion', 'sustainable', 'pre-loved', 'second-hand', 'clothing', 'reluv'],
  openGraph: {
    title: 'Reluv App - Premium Thrift Store',
    description: 'Discover premium thrifted fashion at Reluv. Shop securely, sell your pre-loved items, and join our sustainable fashion community.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}
