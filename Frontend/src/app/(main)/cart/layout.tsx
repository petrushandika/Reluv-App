import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shopping Cart | Reluv App",
  description: "View your shopping cart and checkout.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
