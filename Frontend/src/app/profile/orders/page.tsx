'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ChevronLeft,
  Package,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { getMe } from '@/features/user/api/userApi';
import { User as UserType } from '@/features/auth/types';
import { PrivateRoute } from '@/shared/components/guards/RouteGuards';
import ProfileSidebar from '@/shared/components/organisms/ProfileSidebar';
import { api } from '@/shared/lib/axios';
import Image from 'next/image';

type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  total: number;
  variant: {
    id: number;
    size: string;
    color: string;
    image: string;
    product: {
      id: number;
      name: string;
      slug: string;
      images: string[];
    };
  };
}

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  itemsAmount: number;
  shippingCost: number;
  discountAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'PAID':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'COMPLETED':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'REFUNDED':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const OrdersPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      try {
        const [userData, ordersData] = await Promise.all([
          getMe(),
          api.get<Order[]>('/orders'),
        ]);
        setUser(userData);
        setOrders(ordersData.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setUser(null);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="lg:hidden">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Order History
                </h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    Order History
                  </h1>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
                  <div className="mb-8 flex items-center justify-center">
                    <Package className="w-24 h-24 sm:w-32 sm:h-32 text-sky-600 dark:text-sky-400 stroke-[1.5]" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No orders yet
                  </h2>

                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center mb-8 max-w-md">
                    When you place an order, it will appear here.
                  </p>

                  <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-sky-600 dark:bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Order #{order.orderNumber}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                <span>{order.items.length} item(s)</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              Total
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 last:pb-0"
                            >
                              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <Image
                                  src={
                                    item.variant.image ||
                                    item.variant.product.images[0] ||
                                    '/placeholder-product.png'
                                  }
                                  alt={item.variant.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 80px, 96px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                  {item.variant.product.name}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {item.variant.size && (
                                    <span>Size: {item.variant.size}</span>
                                  )}
                                  {item.variant.color && (
                                    <span>Color: {item.variant.color}</span>
                                  )}
                                  <span>Qty: {item.quantity}</span>
                                </div>
                                <p className="text-base font-semibold text-gray-900 dark:text-white">
                                  {formatCurrency(item.total)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.discountAmount > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                Subtotal
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {formatCurrency(order.itemsAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                Discount
                              </span>
                              <span className="text-green-600 dark:text-green-400">
                                -{formatCurrency(order.discountAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600 dark:text-gray-400">
                                Shipping
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {formatCurrency(order.shippingCost)}
                              </span>
                            </div>
                            <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-gray-900 dark:text-white">
                                Total
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() =>
                              router.push(`/profile/orders/${order.id}`)
                            }
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors cursor-pointer"
                          >
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default OrdersPage;
