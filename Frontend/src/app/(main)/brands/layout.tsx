import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Brands | Reluv App",
  description: "Explore premium authentic brands at Reluv App.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
