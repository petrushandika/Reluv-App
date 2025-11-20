'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { loginUser } from '../api/authApi';
import { api } from '../api/authApi';
import { User, LoginPayload, AuthResponse } from '../types';
import { getMe } from '@/features/user/api/userApi';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface AuthState {
  user: User | null;
  token: string | null;
  loginTimestamp: number | null;
  status: Status;
  isAuthenticated: () => boolean;
  login: (data: LoginPayload) => Promise<void>;
  setToken: (token: string) => Promise<void>;
  logout: () => void;
  fetchAndSetUser: () => Promise<void>;
  checkSessionExpiry: () => boolean;
  _setHydrated: () => void;
  isHydrated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loginTimestamp: null,
      status: 'idle',
      isHydrated: false,

      _setHydrated: () => set({ isHydrated: true }),

      isAuthenticated: () => {
        const state = get();
        if (!state.token) return false;
        return state.checkSessionExpiry();
      },

      checkSessionExpiry: () => {
        const state = get();
        if (!state.loginTimestamp) return false;

        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const timeElapsed = now - state.loginTimestamp;

        if (timeElapsed >= twentyFourHours) {
          get().logout();
          return false;
        }

        return true;
      },

      login: async (data: LoginPayload) => {
        set({ status: 'loading' });
        try {
          const response: AuthResponse = await loginUser(data);
          const { token, user } = response;
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({
            user: user,
            token: token,
            loginTimestamp: Date.now(),
            status: 'success',
          });
        } catch (error) {
          delete api.defaults.headers.common['Authorization'];
          set({ status: 'error' });
          console.error('Login failed:', error);
          throw error;
        }
      },

      setToken: async (token: string) => {
        set({ status: 'loading' });
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ token: token, loginTimestamp: Date.now() });
          const freshUser = await getMe();
          set({ user: freshUser, status: 'success' });
        } catch (error) {
          delete api.defaults.headers.common['Authorization'];
          set({ status: 'error', token: null, loginTimestamp: null });
          console.error('Failed to set token:', error);
          throw error;
        }
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null, loginTimestamp: null, status: 'idle' });
      },

      fetchAndSetUser: async () => {
        try {
          const freshUser = await getMe();
          set({ user: freshUser });
        } catch (error) {
          console.error('Session expired or invalid. Logging out.', error);
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        loginTimestamp: state.loginTimestamp,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.token && state.loginTimestamp) {
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;
            const timeElapsed = now - state.loginTimestamp;

            if (timeElapsed >= twentyFourHours) {
              state.logout();
            } else {
              api.defaults.headers.common[
                'Authorization'
              ] = `Bearer ${state.token}`;
            }
          }
          state._setHydrated();
        }
      },
    }
  )
);
