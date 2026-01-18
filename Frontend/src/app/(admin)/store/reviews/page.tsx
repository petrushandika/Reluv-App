"use client"

import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,
  Ticket,
  MessageSquare,
  Star,
  Search,
  Filter,
  TrendingUp,
  Activity,
  UserCheck,
  Zap,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { StoreReviewsList } from "@/features/(admin)/store/components/StoreReviewsList"
import { cn } from "@/shared/lib/utils"

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
]

export default function StoreReviewsPage() {
  const stats = [
    {
      title: "Store Rating",
      value: "4.8",
      description: "Based on 412 reviews",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-900/30",
    },
    {
      title: "Response Rate",
      value: "94%",
      description: "Last 30 days",
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-100 dark:border-emerald-900/30",
    },
    {
      title: "Pending Replies",
      value: "12",
      description: "Need attention",
      icon: Clock,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-500/10",
      border: "border-sky-100 dark:border-sky-900/30",
    },
    {
      title: "Positive Feedback",
      value: "92%",
      description: "4 & 5 star reviews",
      icon: Zap,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
      border: "border-indigo-100 dark:border-indigo-900/30",
    },
  ]

  const ratingBars = [
    { star: 5, percentage: 85 },
    { star: 4, percentage: 10 },
    { star: 3, percentage: 3 },
    { star: 2, percentage: 1 },
    { star: 1, percentage: 1 },
  ]

  return (
    <DashboardShell
      title="Store Reviews"
      type="store"
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.title}</CardTitle>
                <div className={`${stat.bg} ${stat.border} p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border`}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rating Breakdown */}
          <Card className="lg:col-span-1 border-slate-200 dark:border-slate-800 shadow-none rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rating Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ratingBars.map((bar) => (
                <div key={bar.star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-8">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{bar.star}</span>
                    <Star className="h-3 w-3 fill-slate-300 text-slate-300" />
                  </div>
                  <div className="flex-1 h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                      style={{ width: `${bar.percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{bar.percentage}%</span>
                </div>
              ))}
              <div className="mt-8 p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Sentiment Analysis</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">92% of your customers mention "quality" and "fast shipping" in their feedback.</p>
              </div>
            </CardContent>
          </Card>

          {/* Filters & Search */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search comments or customer names..." 
                  className="pl-11 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-sky-500/20 focus:border-sky-500 transition-all border"
                />
              </div>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-none h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border">
                  <Filter className="mr-2 h-4 w-4" />
                  All Stars
                </Button>
                <div className="h-11 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
                <div className="flex-1 md:flex-none flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort By</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Newest First</span>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <StoreReviewsList />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
