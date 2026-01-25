"use client"

import { Button } from "@/shared/components/ui/button"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { StoreProductsList } from "@/features/(admin)/store/components/StoreProductsList"
import { 
  Plus, 
  Download,
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Ticket, 
  Settings,
  MessageSquare,
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
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/store/settings",
    icon: Settings,
  },
]

export default function StoreProductsPage() {
  return (
    <DashboardShell 
      title="Product Inventory" 
      sidebarItems={sidebarItems}
      type="store"
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <Button variant="outline" className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all font-medium text-[10px] uppercase tracking-widest border flex-1 sm:flex-none">
            <Download className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">Export Portfolio</span>
          </Button>
          <Button className="bg-sky-500 hover:bg-sky-600 text-white transition-all active:scale-95 border-none font-medium text-[10px] uppercase tracking-widest h-9 sm:h-10 px-3 sm:px-4 rounded-xl flex-1 sm:flex-none">
            <Plus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">Add New Product</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-1">Total Products</p>
              <h3 className="text-3xl font-medium text-slate-900 dark:text-white tracking-tight">124</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-200 dark:border-slate-800">
              <Package className="h-6 w-6 text-sky-500" />
            </div>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-1">Active Listings</p>
              <h3 className="text-3xl font-medium text-emerald-500 tracking-tight">92</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/5 flex items-center justify-center border border-slate-200 dark:border-slate-800">
              <Plus className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-1">Out of Stock</p>
              <h3 className="text-3xl font-medium text-rose-500 tracking-tight">12</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-rose-500/5 flex items-center justify-center border border-slate-200 dark:border-slate-800">
              <ShoppingCart className="h-6 w-6 text-rose-500" />
            </div>
          </div>
        </div>

        <StoreProductsList />
      </div>
    </DashboardShell>
  )
}
