import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Checkout | Reluv App",
  description: "Securely checkout your items at Reluv App.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
