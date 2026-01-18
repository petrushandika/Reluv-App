"use client"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { StoreProductsList } from "@/features/(admin)/store/components/StoreProductsList"
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Ticket, 
  Settings,
  MessageSquare,
  ChevronDown
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
      title="Product Management" 
      sidebarItems={sidebarItems}
      type="store"
      actions={
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-bold text-xs uppercase tracking-widest border">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700 text-white transition-all active:scale-95 border border-sky-500 dark:border-sky-400 font-bold text-xs uppercase tracking-widest h-10 px-4 rounded-xl shadow-none">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Header */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-sky-500/50 transition-colors">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Products</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">124</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <Package className="h-6 w-6 text-slate-400 group-hover:text-sky-500 transition-colors" />
            </div>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-emerald-500/50 transition-colors">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Active Listings</p>
              <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">92</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/20">
              <Plus className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-rose-500/50 transition-colors">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Out of Stock</p>
              <h3 className="text-3xl font-bold text-rose-600 dark:text-rose-400">12</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-rose-50/50 dark:bg-rose-500/5 flex items-center justify-center border border-rose-100/50 dark:border-rose-900/20">
              <ShoppingCart className="h-6 w-6 text-rose-500" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search products by name or SKU..." 
              className="pl-11 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-sky-500 focus:border-sky-500 rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="h-11 px-5 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 font-bold text-xs uppercase tracking-widest">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sorted by</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Newest First</span>
            </div>
          </div>
        </div>

        {/* Products List */}
        <StoreProductsList />
      </div>
    </DashboardShell>
  )
}
