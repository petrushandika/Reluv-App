"use client"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { 
  Search, 
  ShieldCheck, 
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  ChevronDown
} from "lucide-react"
import { superadminSidebarItems } from "@/features/(admin)/superadmin/constants/sidebarItems"
import { useState, useEffect } from "react"
import { ProductStatusModal } from "@/features/(admin)/superadmin/components/modals/ProductStatusModal"
import { toast } from "sonner"
import { getProducts, updateProductStatus, deleteProductAdmin, ProductListItem, ProductsResponse } from "@/features/(admin)/superadmin/api/superadminApi"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { exportToCsv } from "@/shared/utils/exportToCsv"
import { SuperadminProductsList } from "@/features/(admin)/superadmin/components/SuperadminProductsList"
import { DeleteConfirmModal } from "@/features/(admin)/superadmin/components/modals/DeleteConfirmModal"

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

  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined)
  const [productToDelete, setProductToDelete] = useState<ProductListItem | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const fetchProducts = async (page: number = 1, search: string = "", status: string | undefined = filterStatus) => {
    try {
      setIsLoading(true)
      const response: ProductsResponse = await getProducts({
        page,
        limit: 10,
        search: search || undefined,
        status: status as any,
      })
      setProducts(response.data)
      
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
    fetchProducts(currentPage, searchQuery, filterStatus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, filterStatus])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts(1, searchQuery, filterStatus)
  }

  const confirmStatusChange = async () => {
    if (!selectedProduct) return
    
    const newStatus = actionType === "approve" ? "APPROVED" : "REJECTED"
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, status: newStatus } : p))
    
    try {
      await updateProductStatus(selectedProduct.id, {
        status: newStatus,
        reason: actionType === "reject" ? "Product does not meet quality standards" : undefined
      })
      
      if (actionType === "approve") {
        toast.success(`Product "${selectedProduct.name}" has been approved`)
      } else {
        toast.success(`Product "${selectedProduct.name}" has been rejected`)
      }
      setIsStatusModalOpen(false)
      setSelectedProduct(null)
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${actionType} product`)
      fetchProducts(currentPage, searchQuery, filterStatus) // Rollback
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

  const handleDeleteRequest = (product: ProductListItem) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return
    try {
      await deleteProductAdmin(productToDelete.id)
      toast.success(`Product "${productToDelete.name}" has been deleted`)
      setIsDeleteModalOpen(false)
      setProductToDelete(null)
      await fetchProducts(currentPage, searchQuery, filterStatus)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete product")
    }
  }

  const filterLabel = filterStatus == null || filterStatus === undefined ? "All" : filterStatus.charAt(0) + filterStatus.slice(1).toLowerCase()

  return (
    <DashboardShell 
      title="Products" 
      sidebarItems={superadminSidebarItems}
      type="superadmin"
      branding={
        <div className="text-2xl font-medium text-slate-900 dark:text-white">Superadmin</div>
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="relative w-full min-w-0">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 shrink-0" />
            <input 
              type="text"
              placeholder="Search products across all stores..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-11 h-11 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm font-medium"
            />
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto h-11 px-4 sm:px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border shadow-sm flex items-center justify-center gap-2"
              >
                <Filter className="h-4 w-4 shrink-0" />
                <span className="truncate">{filterLabel}</span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1">
              <DropdownMenuItem
                onClick={() => { setFilterStatus(undefined); setCurrentPage(1) }}
                className="rounded-lg cursor-pointer font-medium text-slate-700 dark:text-slate-300"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { setFilterStatus("PENDING"); setCurrentPage(1) }}
                className="rounded-lg cursor-pointer font-medium text-slate-700 dark:text-slate-300"
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { setFilterStatus("APPROVED"); setCurrentPage(1) }}
                className="rounded-lg cursor-pointer font-medium text-slate-700 dark:text-slate-300"
              >
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => { setFilterStatus("REJECTED"); setCurrentPage(1) }}
                className="rounded-lg cursor-pointer font-medium text-slate-700 dark:text-slate-300"
              >
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            onDelete={handleDeleteRequest}
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

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setProductToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        itemName={productToDelete?.name}
      />
    </DashboardShell>
  )
}
