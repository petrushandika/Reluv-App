import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Kids' Fashion | Reluv App",
  description: "Shop the latest kids' thrifted fashion at Reluv App.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
