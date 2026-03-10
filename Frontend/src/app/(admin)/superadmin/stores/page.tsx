"use client"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { SuperadminStoresList } from "@/features/(admin)/superadmin/components/SuperadminStoresList"
import { 
  Search, 
  Filter, 
  Download,
  Store,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { useEffect, useState } from "react"
import { getStores, updateStoreStatus, StoreListItem, StoresResponse } from "@/features/(admin)/superadmin/api/superadminApi"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { superadminSidebarItems } from "@/features/(admin)/superadmin/constants/sidebarItems"
import { exportToCsv } from "@/shared/utils/exportToCsv"

export default function SuperadminStoresPage() {
  const [stores, setStores] = useState<StoreListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    verified: 0,
    pending: 0,
  })

  const fetchStores = async (page: number = 1, search: string = "") => {
    try {
      setIsLoading(true)
      const response: StoresResponse = await getStores({
        page,
        limit: 10,
        search: search || undefined,
      })
      setStores(response.data)
      setTotalPages(response.meta.totalPages)
      setTotal(response.meta.total)
      
      const activeCount = response.data.filter(s => s.isActive).length
      const verifiedCount = response.data.filter(s => s.isVerified).length
      const pendingCount = response.data.filter(s => !s.isVerified).length
      
      setStats({
        total: response.meta.total,
        active: activeCount,
        verified: verifiedCount,
        pending: pendingCount,
      })
    } catch (error) {
      console.error("Failed to fetch stores:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStores(currentPage, searchQuery)
  }, [currentPage, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchStores(1, searchQuery)
  }

  const handleStatusChange = async (
    storeId: number,
    data: { isActive?: boolean; isVerified?: boolean }
  ) => {
    // Optimistic update
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, ...data } : s))
    
    try {
      await updateStoreStatus(storeId, data)
      // fetchStores(currentPage, searchQuery)
    } catch (error) {
      console.error("Failed to update store status:", error)
      fetchStores(currentPage, searchQuery) // Rollback on error
    }
  }

  const handleExport = () => {
    const dataToExport = stores.map(store => ({
      ID: store.id,
      Name: store.name,
      Slug: store.slug,
      Owner: `${store.user?.firstName || ""} ${store.user?.lastName || ""}`,
      Email: store.user?.email || "",
      Status: store.isActive ? "Active" : "Inactive",
      Verified: store.isVerified ? "Yes" : "No",
      Products: store.totalProducts,
      Sales: store.totalSales,
      Rating: store.rating || 0,
      CreatedAt: store.createdAt,
    }))
    exportToCsv(dataToExport, "reluv-stores-export")
  }

  return (
    <DashboardShell 
      title="Stores" 
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
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Stores</CardTitle>
              <div className="bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <Store className="h-4 w-4 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.total}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">All registered stores</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Stores</CardTitle>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.active}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}% of total` : "0%"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Verified Stores</CardTitle>
              <div className="bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <CheckCircle2 className="h-4 w-4 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.verified}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {stats.total > 0 ? `${Math.round((stats.verified / stats.total) * 100)}% verified` : "0%"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pending Verification</CardTitle>
              <div className="bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-900/30 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 border">
                <XCircle className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.pending}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Needs review
              </p>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search stores by name or slug..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 h-11 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm font-medium shadow-sm"
          />
        </form>
        <Button 
          variant="outline" 
          className="w-full md:w-auto h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border shadow-sm"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : (
          <>
            <SuperadminStoresList 
              stores={stores} 
              onStatusChange={handleStatusChange}
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-xs font-medium text-slate-500">
                  Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} stores
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-medium text-xs"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`h-9 w-9 rounded-xl font-medium text-xs ${
                            currentPage === page
                              ? "bg-sky-600 hover:bg-sky-700 text-white"
                              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-medium text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  )
}

