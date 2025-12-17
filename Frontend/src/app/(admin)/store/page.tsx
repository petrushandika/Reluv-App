"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { toast } from "sonner";
import RevenueChart from "@/features/(admin)/store/components/RevenueChart";
import ProductsChart from "@/features/(admin)/store/components/ProductsChart";
import RecentActivities from "@/features/(admin)/store/components/RecentActivities";
import AlertsCard from "@/features/(admin)/store/components/AlertsCard";

interface DashboardStats {
  revenue: {
    value: string;
    change: number;
    trend: "up" | "down";
  };
  orders: {
    value: string;
    change: number;
    trend: "up" | "down";
  };
  products: {
    value: string;
    change: number;
    trend: "up" | "down";
  };
  customers: {
    value: string;
    change: number;
    trend: "up" | "down";
  };
}

export default function StoreDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeRange, setTimeRange] = useState("7d");

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setStats({
        revenue: { value: "Rp 125.5M", change: 12.5, trend: "up" },
        orders: { value: "1,245", change: 8.2, trend: "up" },
        products: { value: "450", change: -2.1, trend: "down" },
        customers: { value: "3,890", change: 15.3, trend: "up" },
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
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Connection Error</CardTitle>
            <CardDescription>
              We couldn't load your dashboard data. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={fetchDashboardData}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    trend, 
    icon: Icon,
    iconBg 
  }: { 
    title: string; 
    value: string; 
    change: number; 
    trend: "up" | "down";
    icon: any;
    iconBg: string;
  }) => (
    <Card className="glossy-card hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">vs last period</span>
            </div>
          </div>
          <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white glossy-text-title">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="90d">90d</TabsTrigger>
            </TabsList>
          </Tabs>
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats.revenue.value}
          change={stats.revenue.change}
          trend={stats.revenue.trend}
          icon={DollarSign}
          iconBg="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders.value}
          change={stats.orders.change}
          trend={stats.orders.trend}
          icon={ShoppingBag}
          iconBg="bg-gradient-to-br from-sky-500 to-blue-600"
        />
        <StatCard
          title="Total Products"
          value={stats.products.value}
          change={stats.products.change}
          trend={stats.products.trend}
          icon={Package}
          iconBg="bg-gradient-to-br from-purple-500 to-violet-600"
        />
        <StatCard
          title="Total Customers"
          value={stats.customers.value}
          change={stats.customers.change}
          trend={stats.customers.trend}
          icon={Users}
          iconBg="bg-gradient-to-br from-orange-500 to-red-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glossy-card">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Your revenue performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart data={[
                { name: "Mon", revenue: 4000, orders: 24 },
                { name: "Tue", revenue: 3000, orders: 13 },
                { name: "Wed", revenue: 2000, orders: 98 },
                { name: "Thu", revenue: 2780, orders: 39 },
                { name: "Fri", revenue: 1890, orders: 48 },
                { name: "Sat", revenue: 2390, orders: 38 },
                { name: "Sun", revenue: 3490, orders: 43 },
              ]} />
            </CardContent>
          </Card>
          
          <Card className="glossy-card">
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Sales distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsChart data={[
                { name: "Sneakers", value: 400, color: "#3b82f6" },
                { name: "Jeans", value: 300, color: "#a855f7" },
                { name: "T-Shirts", value: 300, color: "#ef4444" },
                { name: "Jackets", value: 200, color: "#f59e0b" },
              ]} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
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
