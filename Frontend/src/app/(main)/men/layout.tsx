import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Men's Fashion | Reluv App",
  description: "Shop the latest men's thrifted fashion at Reluv App.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
