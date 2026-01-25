"use client"

import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Ticket, 
  MessageSquare, 
  Settings,
  Clock, 
  CheckCircle2, 
  Truck,
  Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { StoreOrdersList } from "@/features/(admin)/store/components/StoreOrdersList"

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
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/store/settings",
    icon: Settings,
  },
]

import { useEffect, useState } from "react"
import { getDashboardAnalytics, DashboardAnalytics } from "@/features/(admin)/store/api/storeApi"
import { Skeleton } from "@/shared/components/ui/skeleton"

export default function StoreOrdersPage() {
  const [data, setData] = useState<DashboardAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await getDashboardAnalytics()
        setData(response)
      } catch (error) {
        console.error("Failed to fetch order stats:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    {
      title: "Total Orders",
      value: data?.stats.totalOrders.toString() || "0",
      description: "Lifetime history",
      icon: ShoppingCart,
      color: "text-sky-500",
      bg: "bg-sky-50 dark:bg-sky-500/5",
    },
    {
      title: "Pending",
      value: data?.stats.pendingOrders.toString() || "0",
      description: "Needs attention",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/5",
    },
    {
      title: "Shipped",
      value: data?.stats.shippedOrders.toString() || "0",
      description: "In transit",
      icon: Truck,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-600/5",
    },
    {
      title: "Completed",
      value: data?.stats.completedOrders.toString() || "0",
      description: "Successfully delivered",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/5",
    },
  ]

  return (
    <DashboardShell
      title="Order Manifest"
      type="store"
      sidebarItems={sidebarItems}
      actions={
        <Button variant="outline" className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all font-medium text-[10px] uppercase tracking-widest border w-full sm:w-auto">
          <Download className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="truncate">Export Transaction Log</span>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))
          ) : (
            stats.map((stat) => (
              <div key={stat.title} className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{stat.title}</span>
                  <div className={`${stat.bg} p-2 rounded-lg border border-slate-100 dark:border-slate-800`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-medium text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                  <p className="text-[10px] font-medium text-slate-400 uppercase mt-1 tracking-widest">{stat.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <StoreOrdersList />
      </div>
    </DashboardShell>
  )
}
