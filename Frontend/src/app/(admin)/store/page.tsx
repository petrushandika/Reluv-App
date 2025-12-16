"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  RefreshCw 
} from "lucide-react";
import StatCard from "@/features/(admin)/store/components/StatCard";
import RevenueChart from "@/features/(admin)/store/components/RevenueChart";
import ProductsChart from "@/features/(admin)/store/components/ProductsChart";
import RecentActivities from "@/features/(admin)/store/components/RecentActivities";
import AlertsCard from "@/features/(admin)/store/components/AlertsCard";
import StoreHeader from "@/features/(admin)/store/components/shared/StoreHeader";
import { toast } from "sonner";

export default function StoreDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setAnalytics({
        revenue: { value: "Rp 125.5M", trend: 12.5, isPositive: true },
        orders: { value: "1,245", trend: 8.2, isPositive: true },
        products: { value: "450", trend: 2.1, isPositive: false },
        customers: { value: "3,890", trend: 15.3, isPositive: true },
        recentActivities: [], // Populate if needed for specific props
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] w-full p-6">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center shadow-sm">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connection Error</h3>
            <p className="text-base text-gray-500 dark:text-gray-400">
              We couldn't load your dashboard data properly. Please check your connection and try again.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <StoreHeader 
        title="Dashboard" 
        description={`Welcome back! Here's what's happening with your store today.`}
      >
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </StoreHeader>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={analytics.revenue.value}
          icon={DollarSign}
          iconColor="bg-green-500"
          trend={analytics.revenue}
        />
        <StatCard
          title="Total Orders"
          value={analytics.orders.value}
          icon={ShoppingBag}
          iconColor="bg-sky-500"
          trend={analytics.orders}
        />
        <StatCard
          title="Total Products"
          value={analytics.products.value}
          icon={BarChart3}
          iconColor="bg-purple-500"
          trend={analytics.products}
        />
        <StatCard
          title="Total Customers"
          value={analytics.customers.value}
          icon={Users}
          iconColor="bg-orange-500"
          trend={analytics.customers}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Charts) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Overview</h3>
            <RevenueChart data={[
              { name: "Mon", revenue: 4000, orders: 24 },
              { name: "Tue", revenue: 3000, orders: 13 },
              { name: "Wed", revenue: 2000, orders: 98 },
              { name: "Thu", revenue: 2780, orders: 39 },
              { name: "Fri", revenue: 1890, orders: 48 },
              { name: "Sat", revenue: 2390, orders: 38 },
              { name: "Sun", revenue: 3490, orders: 43 },
            ]} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Product Performance</h3>
            <ProductsChart data={[
               { name: "Sneakers", value: 400, color: "#3b82f6" },
               { name: "Jeans", value: 300, color: "#a855f7" },
               { name: "T-Shirts", value: 300, color: "#ef4444" },
               { name: "Jackets", value: 200, color: "#f59e0b" },
            ]} />
          </div>
        </div>

        {/* Right Column (Alerts & Activity) */}
        <div className="space-y-8">
          <AlertsCard alerts={[
            { id: "1", title: "Low Stock: Nike Air Max", type: "warning", message: "Only 2 items left", count: 2 },
            { id: "2", title: "New Review", type: "info", message: "5 star review received" },
          ]} />
          <RecentActivities activities={[
            { id: "1", type: "order", title: "New Order #ORD-001", description: "John Doe placed an order", timestamp: new Date(Date.now() - 1000 * 60 * 2), amount: 1500000 },
            { id: "2", type: "product", title: "Product Updated", description: "Admin updated Nike Air Max stock", timestamp: new Date(Date.now() - 1000 * 60 * 60) },
            { id: "3", type: "review", title: "New Review", description: "Alice left a review on Adidas Boost", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
          ]} />
        </div>
      </div>
    </div>
  );
}
