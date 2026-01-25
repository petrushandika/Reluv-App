import { useEffect } from 'react';
import { useNotificationStore } from '../store/notifications.store';
import { useAuthStore } from '@/features/(auth)/store/auth.store';

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    page,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    reset,
  } = useNotificationStore();
  
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      fetchNotifications(1);
    } else {
      reset();
    }
  }, [token, fetchNotifications, reset]);

  return {
    notifications,
    unreadCount,
    isLoading,
    hasMore,
    page,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};
