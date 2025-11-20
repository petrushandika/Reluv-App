"use client";

import axios from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore.getState();
    
    if (authStore.token) {
      if (!authStore.checkSessionExpiry()) {
        return Promise.reject(new Error('Session expired'));
      }
      config.headers["Authorization"] = `Bearer ${authStore.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        // Unauthorized - clear token
        const authStore = useAuthStore.getState();
        if (authStore.logout) {
          authStore.logout();
        }
      }
    }
    return Promise.reject(error);
  }
);
