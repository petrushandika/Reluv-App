import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your Wishlist | Reluv App",
  description: "View your saved items and favorite products.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
