"use client";

import { api } from "@/shared/lib/axios";
import { User } from "@/features/auth/types";
import { UpdateUserPayload, UpdateUserProfilePayload } from "../types";

export const getMe = async (): Promise<User> => {
  try {
    const response = await api.get<User>("/users/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMe = async (data: UpdateUserPayload): Promise<User> => {
  try {
    const response = await api.patch<User>("/users/me", data);
    return response.data;
  } catch (error) {
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
    throw error;
  }
};

export const updateMyProfileAvatar = async (
  file: File
): Promise<User> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.patch<User>("/users/me/profile", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};