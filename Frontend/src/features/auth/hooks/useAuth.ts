import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { api } from "../api/authApi";

export const useAuth = () => {
  const { user, token, status, isAuthenticated, login, logout, isHydrated } =
    useAuthStore((state) => ({
      user: state.user,
      token: state.token,
      status: state.status,
      isAuthenticated: state.isAuthenticated,
      login: state.login,
      logout: state.logout,
      isHydrated: state.isHydrated,
    }));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

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
