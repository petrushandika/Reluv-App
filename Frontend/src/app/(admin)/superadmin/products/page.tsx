"use client"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert,
  Package,
  CheckCircle2,
  XCircle,
  Store,
  AlertCircle
} from "lucide-react"
import { superadminSidebarItems } from "@/features/(admin)/superadmin/constants/sidebarItems"
import { useState } from "react"

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
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
  }

  const stats = {
    total: 1248,
    pending: 12,
    approved: 1156,
    rejected: 80,
  }

  return (
    <DashboardShell 
      title="Products" 
      sidebarItems={superadminSidebarItems}
      type="superadmin"
      branding={
        <h1 className="text-2xl font-medium text-slate-900 dark:text-white">Superadmin</h1>
      }
      actions={
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <Button 
            variant="outline" 
            className="rounded-xl border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-widest h-10 px-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Audit Logs
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Products</CardTitle>
              <div className="bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <Package className="h-4 w-4 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.total}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">All products</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pending Review</CardTitle>
              <div className="bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.pending}</div>
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center bg-amber-50 dark:bg-amber-500/10 w-fit px-1.5 py-0.5 rounded uppercase tracking-widest">
                Needs review
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Approved</CardTitle>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.approved}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {stats.total > 0 ? `${Math.round((stats.approved / stats.total) * 100)}% approved` : "0%"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rejected</CardTitle>
              <div className="bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <XCircle className="h-4 w-4 text-rose-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.rejected}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {stats.total > 0 ? `${Math.round((stats.rejected / stats.total) * 100)}% rejected` : "0%"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search products across all stores..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 h-11 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm font-medium"
            />
          </form>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="flex-1 md:flex-none h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingProducts.map((p) => (
            <Card key={p.id} className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl overflow-hidden transition-all group hover:border-sky-500/30">
              <div className="h-48 bg-slate-50 dark:bg-slate-900 relative border-b border-slate-100 dark:border-slate-800">
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-3 py-1 rounded-full">
                    {p.status}
                  </Badge>
                </div>
                <div className="h-full w-full flex items-center justify-center text-slate-200 dark:text-slate-800">
                  <Package className="h-16 w-16 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardContent className="p-5 space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 text-lg group-hover:text-sky-600 transition-colors">
                    {p.name}
                  </h4>
                  <div className="flex items-center mt-1">
                    <div className="h-4 w-4 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center mr-2">
                      <Store className="h-2.5 w-2.5 text-sky-600" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {p.store}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {p.category}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Rp. {p.price.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-10 text-emerald-600 border-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all font-bold text-[10px] uppercase tracking-wider rounded-xl"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-10 text-rose-600 border-rose-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-bold text-[10px] uppercase tracking-wider rounded-xl"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
