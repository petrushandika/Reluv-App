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
        return Promise.reject(new Error("Session expired"));
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
    if (response.data && typeof response.data === "object") {
      if ("data" in response.data && "success" in response.data) {
        const extractedData = response.data.data;
        if ("meta" in response.data) {
          return {
            ...response,
            data: extractedData,
          };
        }
        return {
          ...response,
          data: extractedData,
        };
      }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.data && typeof error.response.data === "object") {
        if (
          "message" in error.response.data &&
          "error" in error.response.data
        ) {
          const errorMessage = Array.isArray(error.response.data.message)
            ? error.response.data.message.join(", ")
            : error.response.data.message || error.response.data.error;
          error.message = errorMessage;
          error.response.data = errorMessage;
        }
      }
      if (error.response.status === 401) {
        const authStore = useAuthStore.getState();
        if (authStore.logout) {
          authStore.logout();
        }
      }
    }
    return Promise.reject(error);
  }
);
