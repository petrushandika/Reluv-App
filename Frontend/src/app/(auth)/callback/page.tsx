'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/(auth)/store/auth.store';
import { useCartStore } from '@/features/(main)/cart/store/cart.store';
import { useWishlistStore } from '@/features/(main)/wishlist/store/wishlist.store';
import Spinner from '@/shared/components/common/Spinner';

const CallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      setToken(token)
        .then(async () => {
          const user = useAuthStore.getState().user;
          
          // Only fetch cart and wishlist for USER role
          if (user?.role === "USER") {
            await Promise.all([fetchCart(), fetchWishlist()]);
          }
          
          localStorage.removeItem('previousPage');
          
          // Redirect based on role
          if (user?.role === "STORE") {
            router.push('/store');
          } else if (user?.role === "ADMIN") {
            router.push('/superadmin');
          } else {
            const previousPage = localStorage.getItem('previousPage') || '/';
            router.push(previousPage);
          }
        })
        .catch(() => {
          router.push('/login?error=authentication_failed');
        });
    } else {
      router.push('/login?error=no_token');
    }
  }, [searchParams, setToken, router, fetchCart, fetchWishlist]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center space-y-4">
        <Spinner size="lg" fullScreen={false} className="mx-auto" />
        <p className="text-gray-600 dark:text-gray-300">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};

export default function CallbackPage() {
  return (
    <Suspense
      fallback={<Spinner />}
    >
      <CallbackContent />
    </Suspense>
  );
}
