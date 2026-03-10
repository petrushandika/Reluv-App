import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Home | Premium Thrift Store",
  description: "Welcome to Reluv App, the best place for premium thrifted fashion.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
