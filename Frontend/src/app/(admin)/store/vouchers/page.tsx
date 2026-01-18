"use client"

import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,
  Ticket,
  MessageSquare,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Activity,
  UserCheck,
  AlertCircle,
  Settings
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { StoreVouchersList } from "@/features/(admin)/store/components/StoreVouchersList"

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

export default function StoreVouchersPage() {
  const stats = [
    {
      title: "Active Vouchers",
      value: "8",
      description: "Live promotions",
      icon: Ticket,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-500/10",
      border: "border-sky-100 dark:border-sky-900/30",
    },
    {
      title: "Total Redemptions",
      value: "412",
      description: "+12.5% this month",
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-100 dark:border-emerald-900/30",
    },
    {
      title: "Conversion Rate",
      value: "6.8%",
      description: "Voucher attribution",
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      border: "border-indigo-100 dark:border-indigo-900/30",
    },
    {
      title: "About to Expire",
      value: "2",
      description: "Within 48 hours",
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-900/30",
    },
  ]

  return (
    <DashboardShell
      title="Store Vouchers"
      type="store"
      sidebarItems={sidebarItems}
      actions={
        <Button className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-widest h-10 px-4 transition-all shadow-none">
          <Plus className="mr-2 h-4 w-4" />
          Create New Voucher
        </Button>
      }
    >
      <div className="space-y-6">
        {}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.title}</CardTitle>
                <div className={`${stat.bg} ${stat.border} p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stat.value}</div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name or code..." 
              className="pl-11 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-sky-500/20 focus:border-sky-500 transition-all border"
            />
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border">
              <Filter className="mr-2 h-4 w-4" />
              Status Filter
            </Button>
            <div className="h-11 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <div className="flex-1 md:flex-none flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sorting By</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Active Feed</span>
            </div>
          </div>
        </div>

        {}
        <StoreVouchersList />
      </div>
    </DashboardShell>
  )
}
