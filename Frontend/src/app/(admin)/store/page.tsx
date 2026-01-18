"use client"

import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { StoreOverview } from "@/features/(admin)/store/components/StoreOverview"
import { StoreRecentSales } from "@/features/(admin)/store/components/StoreRecentSales"
import { 
  Download, 
  Plus, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Ticket, 
  Settings,
  Star,
  DollarSign
} from "lucide-react"

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/store",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/store/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/store/orders",
    icon: ShoppingCart,
  },
  {
    label: "Vouchers",
    href: "/store/vouchers",
    icon: Ticket,
  },
  {
    label: "Reviews",
    href: "/store/reviews",
    icon: Star,
  },
  {
    label: "Settings",
    href: "/store/settings",
    icon: Settings,
  },
]

export default function StoreDashboardPage() {
  return (
    <DashboardShell 
      title="Dashboard" 
      sidebarItems={sidebarItems}
      type="store"
      actions={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white transition-all active:scale-95 border border-sky-500 dark:border-sky-400 font-bold text-xs uppercase tracking-widest h-10 px-4 rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-emerald-200 dark:hover:border-emerald-900/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Store Revenue</CardTitle>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-900/20 group-hover:bg-emerald-100 transition-colors">
                <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">Rp. 12.431.890</div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center bg-emerald-50 dark:bg-emerald-500/10 w-fit px-1.5 py-0.5 rounded">
                +12.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-sky-200 dark:hover:border-sky-900/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Products</CardTitle>
              <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-lg border border-sky-100 dark:border-sky-900/20 group-hover:bg-sky-100 transition-colors">
                <Package className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">+45</div>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">2 drafts awaiting approval</p>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-amber-200 dark:hover:border-amber-900/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Store Rating</CardTitle>
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-100 dark:border-amber-900/20 group-hover:bg-amber-100 transition-colors">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">4.8 / 5.0</div>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">128 verified reviews</p>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Velocity</CardTitle>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-900/20 group-hover:bg-indigo-100 transition-colors">
                <ShoppingCart className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">+12</div>
              <p className="text-[10px] text-rose-500 font-bold mt-1 uppercase tracking-wider flex items-center bg-rose-50 dark:bg-rose-500/10 w-fit px-1.5 py-0.5 rounded">4 needs shipment</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-7">
          {/* Sales Revenue Section */}
          <Card className="lg:col-span-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-800/50">
              <div className="space-y-1">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Sales Revenue</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                  Performance overview for the current month
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-600">Monthly</button>
                <button className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Weekly</button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[350px] w-full">
                <StoreOverview />
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders Section */}
          <Card className="lg:col-span-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-none">
            <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Sales</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                    You have <span className="text-sky-600 dark:text-sky-400 font-bold">12 orders</span> to process.
                  </CardDescription>
                </div>
                <div className="p-2 bg-sky-50 dark:bg-sky-500/10 rounded-xl border border-sky-100 dark:border-sky-900/30">
                  <ShoppingCart className="h-4 w-4 text-sky-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[450px]">
              <div className="px-6 py-6 flex-1 overflow-y-auto scrollbar-hide">
                <StoreRecentSales />
              </div>
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">128 Total Orders</p>
                <button className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest hover:text-sky-700 transition-colors flex items-center cursor-pointer">
                  View All
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
