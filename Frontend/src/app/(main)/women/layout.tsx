import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Women's Fashion | Reluv App",
  description: "Shop the latest women's thrifted fashion at Reluv App.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
