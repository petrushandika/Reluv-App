"use client"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download
} from "lucide-react"
import { superadminSidebarItems } from "@/features/(admin)/superadmin/constants/sidebarItems"
import { useState, useEffect } from "react"
import { ProductStatusModal } from "@/features/(admin)/superadmin/components/modals/ProductStatusModal"
import { toast } from "sonner"
import { getProducts, updateProductStatus, ProductListItem, ProductsResponse } from "@/features/(admin)/superadmin/api/superadminApi"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { exportToCsv } from "@/shared/utils/exportToCsv"
import { SuperadminProductsList } from "@/features/(admin)/superadmin/components/SuperadminProductsList"

export default function SuperadminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")
  const [currentPage, setCurrentPage] = useState(1)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  const fetchProducts = async (page: number = 1, search: string = "") => {
    try {
      setIsLoading(true)
      const response: ProductsResponse = await getProducts({
        page,
        limit: 10,
        search: search || undefined,
        status: "PENDING", // Show pending products for review
      })
      setProducts(response.data)
      
      // Fetch all products for stats
      const allProducts = await getProducts({ limit: 1000 })
      const pendingCount = allProducts.data.filter(p => p.status === "PENDING").length
      const approvedCount = allProducts.data.filter(p => p.status === "APPROVED").length
      const rejectedCount = allProducts.data.filter(p => p.status === "REJECTED").length
      
      setStats({
        total: allProducts.meta.total,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      })
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast.error("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage, searchQuery)
  }, [currentPage, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts(1, searchQuery)
  }

  const confirmStatusChange = async () => {
    if (!selectedProduct) return
    try {
      await updateProductStatus(selectedProduct.id, {
        status: actionType === "approve" ? "APPROVED" : "REJECTED",
        reason: actionType === "reject" ? "Product does not meet quality standards" : undefined
      })
      
      if (actionType === "approve") {
        toast.success(`Product "${selectedProduct.name}" has been approved`)
      } else {
        toast.success(`Product "${selectedProduct.name}" has been rejected`)
      }
      setIsStatusModalOpen(false)
      setSelectedProduct(null)
      await fetchProducts(currentPage, searchQuery)
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${actionType} product`)
    }
  }

  const handleExport = () => {
    const dataToExport = products.map(product => ({
      ID: product.id,
      Name: product.name,
      Slug: product.slug,
      Price: product.price,
      Status: product.status,
      Category: product.category?.name || "N/A",
      Store: product.store?.name || "N/A",
      CreatedAt: product.createdAt,
    }))
    exportToCsv(dataToExport, "reluv-products-export")
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
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
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

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
          <Button 
            variant="outline" 
            className="w-full md:w-auto h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border shadow-sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
        ) : (
          <SuperadminProductsList 
            products={products}
            onStatusChange={(productId, status) => {
              const product = products.find(p => p.id === productId)
              if (product) {
                setSelectedProduct(product)
                setActionType(status === "APPROVED" ? "approve" : "reject")
                setIsStatusModalOpen(true)
              }
            }}
          />
        )}
      </div>

      <ProductStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setSelectedProduct(null)
        }}
        onConfirm={confirmStatusChange}
        actionType={actionType}
        productName={selectedProduct?.name}
      />
    </DashboardShell>
  )
}
