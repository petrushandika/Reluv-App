"use client"

import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart,
  Ticket,
  MessageSquare,
  Plus,
  TrendingUp,
  UserCheck,
  AlertCircle,
  Settings
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { StoreVouchersList } from "@/features/(admin)/store/components/StoreVouchersList"
import { useState } from "react"
import { VoucherModal } from "@/features/(admin)/store/components/modals/VoucherModal"

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const stats = [
    {
      title: "Active Vouchers",
      value: "8",
      description: "Live promos",
      icon: Ticket,
      color: "text-sky-500",
      bg: "bg-sky-50 dark:bg-sky-500/5",
    },
    {
      title: "Redemptions",
      value: "412",
      description: "+12.5% Month",
      icon: UserCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/5",
    },
    {
      title: "Conversion",
      value: "6.8%",
      description: "Attribution",
      icon: TrendingUp,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-600/5",
    },
    {
      title: "Expiring",
      value: "2",
      description: "Within 48h",
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/5",
    },
  ]

  return (
    <DashboardShell
      title="Promotional Hub"
      type="store"
      sidebarItems={sidebarItems}
      actions={
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-[10px] uppercase tracking-widest h-9 sm:h-10 px-3 sm:px-4 border-none transition-all active:scale-95 w-full sm:w-auto"
        >
          <Plus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="truncate">Create New Campaign</span>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
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
          ))}
        </div>

        <StoreVouchersList />
      </div>

      <VoucherModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create" 
      />
    </DashboardShell>
  )
}
