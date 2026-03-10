import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "My Profile | Reluv App",
  description: "Manage your profile, orders, and settings.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
