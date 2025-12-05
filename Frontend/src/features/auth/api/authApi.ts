import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  User,
} from "../types";
import { api } from "@/shared/lib/axios";

export { api };

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<{ token: string }>("/auth/login", data);
  const token = response.data.token || response.data;
  
  if (!token || typeof token !== "string") {
    throw new Error("Token not received from server");
  }

  const originalAuth = api.defaults.headers.common["Authorization"];
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
  try {
    const userResponse = await api.get<User>("/users/me");
    const user = userResponse.data;
    
    return {
      token,
      user,
    };
  } catch (error) {
    api.defaults.headers.common["Authorization"] = originalAuth;
    throw error;
  }
};

export const forgotPassword = async (data: ForgotPasswordPayload) => {
  const response = await api.post("/auth/forgot", data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordPayload) => {
  const response = await api.post("/auth/reset", data);
  return response.data;
};

export const redirectToGoogleAuth = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    const currentPath = window.location.pathname;
    if (currentPath !== "/auth/login" && currentPath !== "/auth/register") {
      localStorage.setItem("previousPage", currentPath);
    } else {
      localStorage.setItem("previousPage", "/");
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }
};

export const redirectToFacebookAuth = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    const currentPath = window.location.pathname;
    if (currentPath !== "/auth/login" && currentPath !== "/auth/register") {
      localStorage.setItem("previousPage", currentPath);
    } else {
      localStorage.setItem("previousPage", "/");
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;
  }
};

export const verification = async (email: string) => {
  const response = await api.post("/auth/verification", { email });
  return response.data;
};