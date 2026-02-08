"use client"

import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  Search,
  Filter,
  Download,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { SuperadminOrdersList } from "@/features/(admin)/superadmin/components/SuperadminOrdersList"
import { superadminSidebarItems } from "@/features/(admin)/superadmin/constants/sidebarItems"
import { useState, useEffect } from "react"
import { getOrders, OrdersResponse } from "@/features/(admin)/superadmin/api/superadminApi"
import { Skeleton } from "@/shared/components/ui/skeleton"

export default function SuperadminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState({
    totalGMV: 0,
    totalOrders: 0,
    activeDisputes: 0,
    growthRate: 0,
  })

  const fetchOrders = async (page: number = 1, search: string = "") => {
    try {
      setIsLoading(true)
      const response: OrdersResponse = await getOrders({
        page,
        limit: 10,
        search: search || undefined,
      })
      setTotalPages(response.meta.totalPages)
      setTotal(response.meta.total)
      
      // Calculate stats from orders
      const totalGMV = response.data.reduce((sum, order) => sum + order.totalAmount, 0)
      const activeDisputes = response.data.filter(o => o.status === "CANCELLED").length
      
      setStats({
        totalGMV,
        totalOrders: response.meta.total,
        activeDisputes,
        growthRate: 18.4, // This would come from backend analytics
      })
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(currentPage, searchQuery)
  }, [currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchOrders(1, searchQuery)
  }

  return (
    <DashboardShell
      title="Orders"
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
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
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
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Global GMV</CardTitle>
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Rp. {stats.totalGMV.toLocaleString("id-ID")}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Total platform revenue
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Orders</CardTitle>
                <div className="bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                  <ShoppingCart className="h-4 w-4 text-sky-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.totalOrders.toLocaleString()}</div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  All time transactions
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Disputes</CardTitle>
                <div className="bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.activeDisputes}</div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Needs attention
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Growth Rate</CardTitle>
                <div className="bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                  <TrendingUp className="h-4 w-4 text-violet-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">+{stats.growthRate}%</div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Compared to last month
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by order ID, customer, or store..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 h-11 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm font-medium"
            />
          </form>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <SuperadminOrdersList />
      </div>
    </DashboardShell>
  )
}
