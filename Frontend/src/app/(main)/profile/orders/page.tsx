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
import { useAuthStore } from '@/features/(auth)/store/auth.store';
import { getMe } from '@/features/(main)/user/api/userApi';
import { User as UserType } from '@/features/(auth)/types';
import { PrivateRoute } from '@/shared/components/guards/RouteGuards';
import ProfileSidebar from '@/shared/components/layout/ProfileSidebar';
import Image from 'next/image';
import Spinner from '@/shared/components/common/Spinner';
import { getOrders } from '@/features/(main)/orders/api/ordersApi';
import { Order } from '@/features/(main)/orders/types';
import { getStatusColor, formatCurrency, formatDate } from '@/features/(main)/orders/utils';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

const OrdersPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const [userData, ordersData] = await Promise.all([
          getMe(),
          getOrders(),
        ]);
        setUser(userData);
        setOrders(ordersData);
      } catch (error) {
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
    return <Spinner />;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
            <div className="lg:hidden">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6 cursor-pointer hover:text-sky-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Order History
                </h1>
              </button>
            </div>

            <ProfileSidebar user={user} />

            <main className="flex-1 min-w-0">
              <div className="hidden lg:block mb-8 lg:pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                    <ShoppingBag className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Order History
                    </h1>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-0.5">Manage and track your purchases</p>
                  </div>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[450px] py-12 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <div className="mb-8 p-6 bg-white dark:bg-slate-950 rounded-full border border-slate-100 dark:border-slate-800 shadow-none">
                    <Package className="w-20 h-20 text-sky-600 dark:text-sky-400 stroke-[1.5]" />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    No orders yet
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8 max-w-sm font-medium">
                    Looks like you haven't made any purchases yet. Your future orders will appear here.
                  </p>

                  <button
                    onClick={() => router.push('/')}
                    className="px-8 py-3 bg-sky-600 dark:bg-sky-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-sky-700 dark:hover:bg-sky-600 transform transition-all active:scale-95 cursor-pointer ring-offset-2 focus:ring-2 focus:ring-sky-500"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden group hover:border-sky-200 dark:hover:border-sky-900/50 transition-all duration-300"
                    >
                      <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2.5">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                Order #{order.orderNumber}
                              </h3>
                              <Badge
                                className={cn(
                                  "px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full border-2",
                                  getStatusColor(order.status)
                                )}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Package className="w-3.5 h-3.5 text-slate-400" />
                                <span>{order.items.length} item(s)</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Total Paid
                            </p>
                            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">
                              {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6">
                        <div className="space-y-5">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-5 pb-5 border-b border-slate-100 dark:border-slate-800 last:border-b-0 last:pb-0 group/item"
                            >
                              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <Image
                                  src={
                                    item.variant.image ||
                                    item.variant.product.images[0] ||
                                    '/placeholder-product.png'
                                  }
                                  alt={item.variant.product.name}
                                  fill
                                  className="object-cover group-hover/item:scale-105 transition-transform duration-500"
                                  sizes="(max-width: 640px) 96px, 112px"
                                />
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 text-base tracking-tight group-hover/item:text-sky-600 transition-colors">
                                  {item.variant.product.name}
                                </h4>
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                  {(item.variant.size || item.variant.color) && (
                                    <div className="flex gap-2">
                                      {item.variant.size && (
                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded-md text-[10px] font-bold text-slate-500 uppercase">Size: {item.variant.size}</span>
                                      )}
                                      {item.variant.color && (
                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 rounded-md text-[10px] font-bold text-slate-500 uppercase">Color: {item.variant.color}</span>
                                      )}
                                    </div>
                                  )}
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Qty: {item.quantity}</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                  {formatCurrency(item.total)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 gap-4">
                           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                              <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                              Estimated Arrival: 2-3 Days
                           </div>
                           <button
                             onClick={() =>
                               router.push(`/profile/orders/${order.id}`)
                             }
                             className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-xl transition-all border border-transparent hover:border-sky-100 dark:hover:border-sky-900/30 active:scale-95 cursor-pointer"
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
