"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginUser } from "../api/authApi";
import { api } from "../api/authApi";
import { User, LoginPayload, AuthResponse } from "../types";
import { getMe } from "@/features/user/api/userApi";

type Status = "idle" | "loading" | "success" | "error";

interface AuthState {
  user: User | null;
  token: string | null;
  status: Status;
  isAuthenticated: () => boolean;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => void;
  fetchAndSetUser: () => Promise<void>;
  _setHydrated: () => void;
  isHydrated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: "idle",
      isHydrated: false,

      _setHydrated: () => set({ isHydrated: true }),

      isAuthenticated: () => !!get().token,

      login: async (data: LoginPayload) => {
        set({ status: "loading" });
        try {
          const response: AuthResponse = await loginUser(data);
          const { token, user } = response;
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({ user: user, token: token, status: "success" });
        } catch (error) {
          delete api.defaults.headers.common["Authorization"];
          set({ status: "error" });
          console.error("Login failed:", error);
          throw error;
        }
      },

      logout: () => {
        delete api.defaults.headers.common["Authorization"];
        set({ user: null, token: null, status: "idle" });
      },

      fetchAndSetUser: async () => {
        try {
          const freshUser = await getMe();
          set({ user: freshUser });
        } catch (error) {
          console.error("Session expired or invalid. Logging out.", error);
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.token) {
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${state.token}`;
          }
          state._setHydrated();
        }
      },
    }
  )
);
