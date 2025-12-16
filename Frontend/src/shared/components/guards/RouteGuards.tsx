'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/(auth)/store/auth.store';
import Spinner from '@/shared/components/common/Spinner';

interface RouteGuardProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: RouteGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function PublicRoute({ children }: RouteGuardProps) {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50">
          <Spinner />
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}

export function AuthOnlyRoute({ children }: RouteGuardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
