import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from './NotificationItem';
import { useRouter } from 'next/navigation';

export const NotificationDropdown = ({ isMobile = false, onCloseMobile }: { isMobile?: boolean, onCloseMobile?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    hasMore, 
    page,
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (isMobile && onCloseMobile) onCloseMobile();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile, onCloseMobile]);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    setIsOpen(false);
    if (isMobile && onCloseMobile) onCloseMobile();

    // Navigate logic based on type
    // You can enhance this with specific routes
    if (notification.type.startsWith('ORDER')) {
       // Assuming data contains orderId or similar
       // router.push(`/profile/orders/${notification.data?.orderId}`);
       router.push('/profile/orders');
    } else {
       // Default fallback
    }
  };

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${isMobile ? 'block' : 'relative'}`} ref={dropdownRef}>
      <button 
        onClick={toggleOpen}
        className="relative p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 outline-none focus:ring-2 focus:ring-sky-500/50"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-all duration-300 transform hover:scale-110" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] md:text-xs font-bold transition-all duration-300 animate-pulse border-2 border-white dark:border-gray-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className={`
            absolute z-50 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden
            ${isMobile 
              ? 'fixed top-[60px] left-4 right-4 max-h-[70vh] rounded-xl' 
              : 'top-full right-0 mt-2 w-80 md:w-96 rounded-xl origin-top-right transform transition-all duration-200 ease-out'
            }
          `}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-sky-200 dark:scrollbar-thumb-sky-800 scrollbar-track-transparent">
            {isLoading && notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
                <p>Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center text-gray-500 dark:text-gray-400">
                <Bell className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onClick={handleNotificationClick} 
                  />
                ))}
                {hasMore && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchNotifications(page + 1);
                    }}
                    className="w-full py-3 text-sm text-center text-sky-600 dark:text-sky-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium border-t border-gray-100 dark:border-gray-700"
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
