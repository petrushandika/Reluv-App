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
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all font-medium text-[10px] uppercase tracking-widest border">
            <Download className="mr-2 h-4 w-4" />
            Export Portfolio
          </Button>
          <Button className="bg-sky-500 hover:bg-sky-600 text-white transition-all active:scale-95 border-none font-medium text-[10px] uppercase tracking-widest h-10 px-4 rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
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
