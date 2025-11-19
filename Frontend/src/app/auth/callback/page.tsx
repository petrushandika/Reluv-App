'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useCartStore } from '@/features/cart/store/cart.store';
import { useWishlistStore } from '@/features/wishlist/store/wishlist.store';

const CallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      const previousPage = localStorage.getItem('previousPage') || '/';

      setToken(token)
        .then(async () => {
          await Promise.all([fetchCart(), fetchWishlist()]);
          localStorage.removeItem('previousPage');
          router.push(previousPage);
        })
        .catch((error) => {
          console.error('Failed to authenticate:', error);
          router.push('/auth/login?error=authentication_failed');
        });
    } else {
      router.push('/auth/login?error=no_token');
    }
  }, [searchParams, setToken, router, fetchCart, fetchWishlist]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
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
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
