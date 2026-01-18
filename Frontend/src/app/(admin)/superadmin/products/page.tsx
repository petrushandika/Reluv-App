"use client"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert,
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users,
  Store,
  Tag,
  BarChart3,
  Settings2,
  ChevronDown,
  Eye,
  CheckCircle2,
  XCircle
} from "lucide-react"

const sidebarItems = [
  {
    label: "Platform Overview",
    href: "/superadmin",
    icon: LayoutDashboard,
  },
  {
    label: "Store Management",
    href: "/superadmin/stores",
    icon: Store,
  },
  {
    label: "User base",
    href: "/superadmin/users",
    icon: Users,
  },
  {
    label: "Product Moderation",
    href: "/superadmin/products",
    icon: ShieldAlert,
  },
  {
    label: "Global Categories",
    href: "/superadmin/categories",
    icon: Tag,
  },
  {
    label: "Analytics",
    href: "/superadmin/analytics",
    icon: BarChart3,
  },
  {
    label: "System Settings",
    href: "/superadmin/settings",
    icon: Settings2,
  },
]

const pendingProducts = [
  {
    id: "PROD-998",
    name: "Luxury Silk Scarf",
    store: "Elegance Boutique",
    price: 750000,
    category: "Accessories",
    status: "pending",
  },
  {
    id: "PROD-999",
    name: "Designer Handbag",
    store: "Paris Vintage",
    price: 8500000,
    category: "Bags",
    status: "pending",
  },
]

export default function SuperadminProductsPage() {
  return (
    <DashboardShell 
      title="Product Moderation" 
      sidebarItems={sidebarItems}
      type="superadmin"
      branding={
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Superadmin</h1>
      }
      actions={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-medium">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Audit Logs
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-slate-900 dark:text-white">
        {/* Moderation Queue Alert */}
        <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-900/40 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-sky-50 dark:bg-sky-500/10 rounded-xl flex items-center justify-center border border-sky-100 dark:border-sky-900/30">
              <ShieldAlert className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-[0.2em] mb-0.5">Global Queue</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">12 Items Awaiting Moderation</p>
            </div>
          </div>
          <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 font-bold text-xs uppercase tracking-wider transition-all active:scale-95">
            Audit Everything
          </Button>
        </div>

        {/* Global Search & Filter Zone */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              placeholder="Search across all stores..." 
              className="w-full pl-11 h-11 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest px-6">
              <Filter className="mr-2 h-4 w-4" />
              Store Filter
            </Button>
          </div>
        </div>

        {/* Pending Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-2">
          {pendingProducts.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all group hover:border-sky-500/30">
               <div className="h-48 bg-slate-50 dark:bg-slate-900 relative border-b border-slate-100 dark:border-slate-800">
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-3 py-1 rounded-full">{p.status}</Badge>
                  </div>
                  <div className="h-full w-full flex items-center justify-center text-slate-200 dark:text-slate-800">
                    <Package className="h-16 w-16 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
               <div className="p-5 space-y-4">
                 <div>
                   <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 text-lg group-hover:text-sky-600 transition-colors">{p.name}</h4>
                   <div className="flex items-center mt-1">
                     <div className="h-4 w-4 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center mr-2">
                       <Store className="h-2.5 w-2.5 text-sky-600" />
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.store}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/50">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category}</span>
                   <span className="text-sm font-bold text-slate-900 dark:text-white">Rp. {p.price.toLocaleString("id-ID")}</span>
                 </div>

                 <div className="grid grid-cols-2 gap-3 pt-1">
                   <Button size="sm" variant="outline" className="h-10 text-emerald-600 border-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all font-bold text-[10px] uppercase tracking-wider rounded-xl">
                     <CheckCircle2 className="h-4 w-4 mr-2" />
                     Approve
                   </Button>
                   <Button size="sm" variant="outline" className="h-10 text-rose-600 border-rose-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-bold text-[10px] uppercase tracking-wider rounded-xl">
                     <XCircle className="h-4 w-4 mr-2" />
                     Reject
                   </Button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
