"use client";

import { useEffect, useState } from "react";
import { getAnalytics, StoreAnalytics } from "@/features/(admin)/store/api/analytics.api";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Star,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export default function StoreDashboardPage() {
  const [analytics, setAnalytics] = useState<StoreAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  const { store, stats, alerts, recentOrders, recentReviews } = analytics;

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      subtitle: `${stats.activeProducts} active`,
      icon: Package,
      color: "bg-sky-500",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      color: "bg-emerald-500",
    },
    {
      title: "Total Revenue",
      value: `Rp ${stats.totalRevenue.toLocaleString()}`,
      subtitle: `Rp ${stats.thisMonthRevenue.toLocaleString()} this month`,
      icon: DollarSign,
      color: "bg-violet-500",
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      subtitle: `${stats.totalReviews} reviews`,
      icon: Star,
      color: "bg-amber-500",
    },
  ];

  const hasAlerts =
    alerts.lowStockProducts.length > 0 ||
    alerts.pendingOrders.length > 0 ||
    alerts.unrepliedReviews.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {store.name}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's what's happening with your store today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {hasAlerts && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Attention Required
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-yellow-800 dark:text-yellow-200">
                {alerts.lowStockProducts.length > 0 && (
                  <li>• {alerts.lowStockProducts.length} products low on stock</li>
                )}
                {alerts.pendingOrders.length > 0 && (
                  <li>• {alerts.pendingOrders.length} pending orders</li>
                )}
                {alerts.unrepliedReviews.length > 0 && (
                  <li>• {alerts.unrepliedReviews.length} unreplied reviews</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.buyer.firstName} {order.buyer.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Rp {order.totalAmount.toLocaleString()}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No recent orders
              </p>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Reviews
            </h2>
          </div>
          <div className="p-6">
            {recentReviews.length > 0 ? (
              <div className="space-y-4">
                {recentReviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {review.productName}
                      </p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {review.comment || "No comment"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      by {review.authorName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No recent reviews
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
