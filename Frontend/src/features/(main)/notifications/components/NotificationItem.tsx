import React from 'react';
import { Notification } from '../types';
import { 
  ShoppingBag, 
  Truck, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  AlertTriangle,
  Tag,
  CreditCard,
  Info 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'ORDER_CREATED':
      return <ShoppingBag className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
    case 'ORDER_PAID':
      return <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />;
    case 'ORDER_SHIPPED':
      return <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    case 'ORDER_DELIVERED':
      return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
    case 'ORDER_CANCELLED':
      return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
    case 'REVIEW_RECEIVED':
      return <MessageSquare className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
    case 'PRODUCT_LOW_STOCK':
      return <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
    case 'VOUCHER_APPLIED':
      return <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    case 'PAYMENT_FAILED':
      return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
    case 'SHIPMENT_UPDATED':
      return <Truck className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
    default:
      return <Info className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  return (
    <div 
      onClick={() => onClick(notification)}
      className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
        !notification.isRead ? 'bg-sky-50/60 dark:bg-sky-900/10' : ''
      }`}
    >
      <div className="flex gap-3">
        <div className="shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
            {notification.body}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
        {!notification.isRead && (
          <div className="shrink-0 self-center">
            <div className="w-2 h-2 rounded-full bg-sky-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
