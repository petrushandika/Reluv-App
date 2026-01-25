import { create } from 'zustand';
import axios from 'axios';
import { Notification, NotificationResponse } from '../types';
import { useAuthStore } from '@/features/(auth)/store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  page: 1,
  hasMore: true,

  fetchNotifications: async (page = 1) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await axios.get<NotificationResponse>(
        `${API_URL}/notifications?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const { data, meta } = response.data;
      
      set((state) => {
        const newNotifications = page === 1 
          ? data 
          : [...state.notifications, ...data];
          
        // Filter unique to be safe
        const uniqueNotifications = Array.from(
          new Map(newNotifications.map(item => [item.id, item])).values()
        );

        const unreadCount = uniqueNotifications.filter(n => !n.isRead).length;

        return {
          notifications: uniqueNotifications,
          unreadCount,
          page: meta.page,
          hasMore: meta.page < meta.totalPages,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: number) => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    // Optimistic update
    set((state) => {
      const updatedNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;
      return { notifications: updatedNotifications, unreadCount };
    });

    try {
      await axios.patch(
        `${API_URL}/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert if needed, but usually fine to leave as read locally
    }
  },

  markAllAsRead: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));

    try {
      await axios.post(
        `${API_URL}/notifications/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  reset: () => {
    set({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      page: 1,
      hasMore: true,
    });
  },
}));
