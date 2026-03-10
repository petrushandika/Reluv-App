import { Metadata } from 'next';
import Navbar from '@/shared/components/layout/Navbar';
import Footer from '@/shared/components/layout/Footer';
import BackToTop from '@/shared/components/layout/BackToTop';

export const metadata: Metadata = {
  title: {
    default: 'Shop Premium Thrift | Reluv App',
    template: '%s | Reluv App'
  },
  description: 'Shop sustainable, pre-loved fashion at Reluv. Find authentic brands and unique styles at a fraction of the cost.',
  keywords: ['thrift store', 'sustainable fashion', 'buy used clothes', 'sell clothes', 'vintage shop'],
};

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
