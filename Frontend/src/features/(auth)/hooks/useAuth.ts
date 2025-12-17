import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { api } from '../api/authApi';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    token,
    status,
    isAuthenticated,
    login,
    logout,
    isHydrated,
    checkSessionExpiry,
  } = useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    status: state.status,
    isAuthenticated: state.isAuthenticated,
    login: state.login,
    logout: state.logout,
    isHydrated: state.isHydrated,
    checkSessionExpiry: state.checkSessionExpiry,
  }));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    if (!isHydrated || !token) return;

    const checkInterval = setInterval(() => {
      if (!checkSessionExpiry()) {
        router.push('/login');
      }
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [isHydrated, token, checkSessionExpiry, router]);

  return {
    user,
    token,
    status,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    isHydrated,
  };
};
