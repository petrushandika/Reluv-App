"use client"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { SuperadminOverview } from "@/features/(admin)/superadmin/components/SuperadminOverview"
import { 
  Download,
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Store,
  BarChart3,
  Calendar
} from "lucide-react"
import { superadminSidebarItems } from "@/features/(admin)/superadmin/constants/sidebarItems"
import { useState, useEffect } from "react"
import { getAnalytics, AnalyticsData } from "@/features/(admin)/superadmin/api/superadminApi"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { exportToCsv } from "@/shared/utils/exportToCsv"

export default function SuperadminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  const fetchAnalytics = async (range: "7d" | "30d" | "90d" | "1y") => {
    try {
      setIsLoading(true)
      const data = await getAnalytics({ timeRange: range })
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      // Set default values on error
      setAnalytics({
        totalRevenue: 0,
        revenueGrowth: 0,
        activeUsers: 0,
        userGrowth: 0,
        totalOrders: 0,
        orderGrowth: 0,
        activeStores: 0,
        storeGrowth: 0,
        conversionRate: 0,
        avgOrderValue: 0,
        customerRetention: 0,
        topCategories: [],
        revenueChart: [],
        userChart: [],
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(timeRange)
  }, [timeRange])

  return (
    <DashboardShell
      title="Analytics"
      type="superadmin"
      sidebarItems={superadminSidebarItems}
      branding={
        <h1 className="text-2xl font-medium text-slate-900 dark:text-white">Superadmin</h1>
      }
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <Button 
            variant="outline" 
            className="rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-widest h-10 px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border"
            onClick={() => {
              if (analytics) {
                exportToCsv([analytics], "reluv-analytics-report")
              }
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Revenue</CardTitle>
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Rp. {analytics?.totalRevenue.toLocaleString("id-ID") || "0"}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    All time revenue
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600 flex items-center w-fit px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    +{analytics?.revenueGrowth || 0}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Users</CardTitle>
                <div className="bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                  <Users className="h-4 w-4 text-sky-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {analytics?.activeUsers.toLocaleString() || "0"}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Monthly active users
                  </p>
                  <p className="text-[10px] font-bold text-sky-600 flex items-center w-fit px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-500/10">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    +{analytics?.userGrowth || 0}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Orders</CardTitle>
                <div className="bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                  <ShoppingCart className="h-4 w-4 text-violet-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {analytics?.totalOrders.toLocaleString() || "0"}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Completed orders
                  </p>
                  <p className="text-[10px] font-bold text-violet-600 flex items-center w-fit px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-500/10">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    +{analytics?.orderGrowth || 0}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Stores</CardTitle>
                <div className="bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                  <Store className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {analytics?.activeStores.toLocaleString() || "0"}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Verified stores
                  </p>
                  <p className="text-[10px] font-bold text-amber-600 flex items-center w-fit px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    +{analytics?.storeGrowth || 0}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time Range</span>
          </div>
          <div className="flex items-center space-x-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {(["7d", "30d", "90d", "1y"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`h-8 px-4 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${
                  timeRange === range
                    ? "bg-sky-600 hover:bg-sky-700 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          <Card className="lg:col-span-4 border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
            <CardHeader className="flex flex-col xs:flex-row items-start xs:items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 gap-4">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Platform Growth</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                  Revenue and user growth over time
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-end xs:self-auto">
                <button className="px-3 py-1.5 text-[9px] font-medium uppercase tracking-widest bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-600">
                  All Metrics
                </button>
                <button className="px-3 py-1.5 text-[9px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
                  Revenue
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 p-4 sm:p-6">
              <div className="h-[300px] sm:h-[350px] w-full">
                <SuperadminOverview />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border-slate-200 dark:border-slate-800 shadow-none rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Top Categories</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                    Best performing categories
                  </CardDescription>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                  <BarChart3 className="h-4 w-4 text-sky-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[450px]">
              <div className="px-6 py-6 flex-1 overflow-y-auto scrollbar-hide">
                <div className="space-y-4">
                  {(analytics?.topCategories || []).length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-4">No data available</p>
                  ) : (
                    analytics?.topCategories.map((category, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`h-10 w-10 bg-sky-500 rounded-lg flex items-center justify-center shrink-0`}>
                          <span className="text-white font-bold text-xs">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {category.name}
                          </p>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Rp. {category.revenue.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              {category.orders} orders
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Conversion Rate</CardTitle>
              <div className="bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-900/30 p-2 rounded-xl border">
                <TrendingUp className="h-4 w-4 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {analytics?.conversionRate || 0}%
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Platform average
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Avg Order Value</CardTitle>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30 p-2 rounded-xl border">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Rp. {Math.round(analytics?.avgOrderValue || 0).toLocaleString("id-ID")}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Per transaction
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer Retention</CardTitle>
              <div className="bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-900/30 p-2 rounded-xl border">
                <Users className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {analytics?.customerRetention || 0}%
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Returning customers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

