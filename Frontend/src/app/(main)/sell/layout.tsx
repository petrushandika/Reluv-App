import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sell Your Items | Reluv App",
  description: "Sell your pre-loved items and earn money on Reluv App.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
