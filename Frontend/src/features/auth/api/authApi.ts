import axios from 'axios';
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '../types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordPayload) => {
  const response = await api.post('/auth/forgot', data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordPayload) => {
  const response = await api.post('/auth/reset', data);
  return response.data;
};

export const redirectToGoogleAuth = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }
};

export const redirectToFacebookAuth = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;
  }
};
