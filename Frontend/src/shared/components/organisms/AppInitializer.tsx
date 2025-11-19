'use client';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { useThemeStore } from '@/shared/store/theme.store';
import { useCartStore } from '@/features/cart/store/cart.store';
import { useWishlistStore } from '@/features/wishlist/store/wishlist.store';
import { useEffect } from 'react';

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isHydrated, fetchAndSetUser, token } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeTheme();
    }
  }, [initializeTheme]);

  useEffect(() => {
    if (isHydrated && token) {
      const initializeData = async () => {
        try {
          Promise.all([
            fetchAndSetUser().catch(console.error),
            fetchCart().catch(console.error),
            fetchWishlist().catch(console.error),
          ]);
        } catch (error) {
          console.error('Failed to initialize user data:', error);
        }
      };
      const timer = setTimeout(initializeData, 0);
      return () => clearTimeout(timer);
    } else if (isHydrated && !token) {
      useCartStore.getState().clearCart();
      useWishlistStore.getState().clearWishlist();
    }
  }, [isHydrated, token, fetchAndSetUser, fetchCart, fetchWishlist]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  return <>{children}</>;
};

export default AppInitializer;
