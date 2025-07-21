"use client";

import { api } from "@/features/auth/api/authApi";
import { User } from "@/features/auth/types";
import { UpdateUserPayload, UpdateUserProfilePayload } from "../types";

export const getMe = async (): Promise<User> => {
  try {
    const response = await api.get<User>("/users/me");
    console.log("Response from /users/me:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};

export const updateMe = async (data: UpdateUserPayload): Promise<User> => {
  try {
    const response = await api.patch<User>("/users/me", data);
    return response.data;
  } catch (error) {
    console.error("Failed to update user data:", error);
    throw error;
  }
};

export const updateMyProfile = async (
  data: UpdateUserProfilePayload
): Promise<User> => {
  try {
    const response = await api.patch<User>("/users/me/profile", data);
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};
