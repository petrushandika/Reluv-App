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
  MessageSquare,
  Star,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/shared/lib/utils"
import { useState } from "react"
import { ProductModal } from "@/features/(admin)/store/components/modals/ProductModal"

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

export default function StoreDashboardPage() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [revenueView, setRevenueView] = useState<"weekly" | "monthly">("weekly")

  return (
    <DashboardShell
      title="Dashboard"
      sidebarItems={sidebarItems}
      type="store"
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <Button 
            variant="outline" 
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-(--bg-secondary) text-slate-600 dark:text-slate-400 font-medium text-[10px] uppercase tracking-widest hover:bg-(--bg-primary) transition-all flex-1 sm:flex-none"
          >
            <Download className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">Export Data</span>
          </Button>
          <Button 
            onClick={() => setIsProductModalOpen(true)}
            className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-[10px] uppercase tracking-widest transition-all active:scale-95 border-none flex-1 sm:flex-none"
          >
            <Plus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">New Product</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Revenue", value: "Rp. 12.4M", trend: "+12.1%", icon: DollarSign, color: "sky" },
            { label: "Active Products", value: "45", trend: "2 new", icon: Package, color: "emerald" },
            { label: "Store Rating", value: "4.8", trend: "128 reviews", icon: Star, color: "amber" },
            { label: "New Orders", value: "12", trend: "4 pending", icon: ShoppingCart, color: "indigo" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
               <Card className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-500/50 transition-all duration-300 overflow-hidden shadow-none">
                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                     <div className={cn(
                      "p-2.5 rounded-xl border border-slate-100 dark:border-slate-800",
                      "bg-sky-50 dark:bg-sky-500/10 text-sky-500"
                    )}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Live</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
                    <div className="flex items-baseline space-x-2">
                       <h3 className="text-3xl font-medium text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
                    </div>
                    <div className="flex items-center pt-2">
                      <div className="flex items-center text-[10px] font-medium text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-xl border border-emerald-500/10 uppercase tracking-widest">
                        {stat.trend}
                      </div>
                      <span className="ml-2 text-[10px] font-medium text-slate-400 uppercase tracking-widest">vs prev</span>
                    </div>
                  </div>

                  {/* Decorative background accent */}
                  <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <stat.icon className="h-20 w-20 text-sky-500" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-7">
          <Card className="lg:col-span-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-none overflow-hidden">
            <CardHeader className="flex flex-col xs:flex-row items-start xs:items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200/50 dark:border-slate-800/50 gap-4">
              <div>
                <CardTitle className="text-lg font-medium text-slate-900 dark:text-white tracking-tight uppercase">Revenue Analytics</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-widest">Performance Insights</CardDescription>
              </div>
              <div className="flex items-center p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl self-end xs:self-auto">
                 <button 
                   onClick={() => setRevenueView("weekly")}
                   className={cn(
                     "px-3 sm:px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest transition-all rounded-lg",
                     revenueView === "weekly" 
                       ? "bg-white dark:bg-slate-800 text-sky-500 shadow-sm border border-slate-200 dark:border-slate-700" 
                       : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-transparent"
                   )}
                 >
                   Weekly
                 </button>
                 <button 
                   onClick={() => setRevenueView("monthly")}
                   className={cn(
                     "px-3 sm:px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest transition-all rounded-lg ml-1",
                     revenueView === "monthly" 
                       ? "bg-white dark:bg-slate-800 text-sky-500 shadow-sm border border-slate-200 dark:border-slate-700" 
                       : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-transparent"
                   )}
                 >
                   Monthly
                 </button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              <div className="h-[300px] sm:h-[380px] w-full">
                <StoreOverview view={revenueView} />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-none overflow-hidden flex flex-col">
            <CardHeader className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium text-slate-900 dark:text-white tracking-tight uppercase">Recent Sales</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-widest">Latest Transactions</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center border border-sky-100 dark:border-sky-900/30">
                  <TrendingUp className="h-5 w-5 text-sky-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col flex-1">
              <div className="px-6 py-6 flex-1 overflow-y-auto max-h-[352px] custom-scrollbar">
                <StoreRecentSales />
              </div>
              <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center mt-auto">
                <Button variant="ghost" className="w-full h-11 bg-sky-50 dark:bg-sky-500/10 text-[10px] font-medium uppercase tracking-[0.2em] text-sky-500 hover:text-sky-600 hover:bg-sky-100 dark:hover:bg-sky-500/20 group rounded-xl transition-all">
                  View Full Transaction Log
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        mode="create" 
      />
    </DashboardShell>
  )
}
