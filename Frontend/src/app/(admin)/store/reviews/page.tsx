"use client"

import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,
  Ticket,
  MessageSquare,
  Star,
  UserCheck,
  Zap,
  Clock,
  Settings
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { StoreReviewsList } from "@/features/(admin)/store/components/StoreReviewsList"

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

export default function StoreReviewsPage() {
  const stats = [
    {
      title: "Store Rating",
      value: "4.8",
      description: "412 Reviews",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/5",
    },
    {
      title: "Response Rate",
      value: "94%",
      description: "Active Replies",
      icon: UserCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/5",
    },
    {
      title: "Pending",
      value: "12",
      description: "Need Action",
      icon: Clock,
      color: "text-sky-500",
      bg: "bg-sky-50 dark:bg-sky-500/5",
    },
    {
      title: "Positive",
      value: "92%",
      description: "Sentiment index",
      icon: Zap,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-500/5",
    },
  ]

  return (
    <DashboardShell
      title="Feedback Feed"
      type="store"
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</span>
                <div className={`${stat.bg} p-2 rounded-lg border border-slate-100 dark:border-slate-800`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        <StoreReviewsList />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Rating Distribution</h4>
             <div className="space-y-4">
               {[
                 { star: 5, percentage: 85 },
                 { star: 4, percentage: 10 },
                 { star: 3, percentage: 3 },
                 { star: 2, percentage: 1 },
                 { star: 1, percentage: 1 },
               ].map((bar) => (
                 <div key={bar.star} className="flex items-center gap-3">
                   <span className="text-[10px] font-bold text-slate-500 w-4">{bar.star}</span>
                   <div className="flex-1 h-1.5 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                     <div className="h-full bg-amber-400" style={{ width: `${bar.percentage}%` }} />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{bar.percentage}%</span>
                 </div>
               ))}
             </div>
           </div>

           <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">System Insights</h4>
             <div className="space-y-4">
               <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                 <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                   Most users are satisfied with <span className="text-sky-600 font-bold">Delivery Speed</span>. Consider improving <span className="text-amber-600 font-bold">Product Packaging</span> based on Recent 3-star reports.
                 </p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  )
}
