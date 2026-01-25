"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { 
  Search, 
  Filter, 
  ChevronDown,
  User,
  Truck,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { OrderManifestModal } from "./modals/OrderManifestModal"
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal"

import { useEffect } from "react"
import { getStoreOrders, StoreOrder } from "../api/storeApi"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function StoreOrdersList() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isManifestOpen, setIsManifestOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [orders, setOrders] = useState<StoreOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await getStoreOrders({
        search,
        page,
        limit: 10,
        status: statusFilter
      })
      setOrders(response.data)
      setMeta(response.meta)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders()
    }, 500)
    return () => clearTimeout(timer)
  }, [search, page, statusFilter])

  const handleView = (order: any) => {
    setSelectedOrder(order)
    setIsManifestOpen(true)
  }

  const handleCancelAction = (order: any) => {
    setSelectedOrder(order)
    setIsCancelModalOpen(true)
  }

  const confirmCancel = () => {
    console.log("Cancelling order:", selectedOrder?.id)
    setIsCancelModalOpen(false)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-500 bg-amber-500/5"
      case "PAID": return "text-sky-500 bg-sky-500/5"
      case "SHIPPED": return "text-indigo-500 bg-indigo-500/5"
      case "DELIVERED": return "text-emerald-500 bg-emerald-500/5"
      case "COMPLETED": return "text-emerald-500 bg-emerald-500/5"
      case "CANCELLED": return "text-rose-500 bg-rose-500/5"
      default: return "text-slate-500 bg-slate-500/5"
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Integrated Search & Filter Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/40">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search orders..." 
            className="pl-9 h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-sky-500/10 focus:border-sky-500 rounded-xl text-xs font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[10px] font-medium uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            <Filter className="mr-2 h-3.5 w-3.5" />
            Filters
            <ChevronDown className="ml-2 h-3.5 w-3.5" />
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] hidden sm:block whitespace-nowrap">
            {meta?.total || 0} Records Found
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="py-5 pl-8 text-[11px] font-medium uppercase tracking-widest text-slate-400">Order ID</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Customer</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Value</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Lifecycle</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-medium uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-8 py-5">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-xl" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell className="pr-8 text-right"><Skeleton className="h-8 w-40 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500 uppercase text-[10px] tracking-widest font-medium">
                  No orders found
                </TableCell>
              </TableRow>
            ) : orders.map((order) => (
              <TableRow 
                key={order.id} 
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 border-none"
              >
                <TableCell className="py-5 pl-8">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-slate-900 dark:text-white tracking-tight">{order.orderNumber}</span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800 overflow-hidden">
                       <img 
                         src={`https://ui-avatars.com/api/?name=${encodeURIComponent(order.buyer.firstName)}&background=random`} 
                         alt={order.buyer.firstName} 
                         className="h-full w-full object-cover"
                       />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[150px]">
                        {`${order.buyer.firstName} ${order.buyer.lastName}`}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]">{order.buyer.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white leading-none">
                      Rp {order.storeItemsTotal.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase mt-1 tracking-tighter">{order.itemsCount} Items</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center justify-center w-24 px-2.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-800",
                    getStatusStyle(order.status)
                  )}>
                    {order.status}
                  </div>
                </TableCell>
                <TableCell className="pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         onClick={() => handleView(order)}
                         className="h-8 w-16 sm:w-20 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                       >
                         View
                       </Button>
                       <Button 
                         variant="ghost" 
                         onClick={() => handleCancelAction(order)}
                         className="h-8 w-16 sm:w-20 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                       >
                         Cancel
                       </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
          Showing {orders.length} of {meta?.total || 0} orders
        </p>
        <div className="flex gap-2">
           <Button 
             variant="outline" 
             size="icon" 
             disabled={page === 1}
             onClick={() => setPage(page - 1)}
             className="h-8 w-8 border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
           >
             <ChevronLeft className="h-4 w-4 text-slate-500" />
           </Button>
           <Button 
             variant="outline" 
             size="icon" 
             disabled={page >= (meta?.totalPages || 1)}
             onClick={() => setPage(page + 1)}
             className="h-8 w-8 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all border-sky-100 dark:border-sky-500/20 disabled:opacity-50"
           >
             <ChevronRight className="h-4 w-4 text-sky-500" />
           </Button>
        </div>
      </div>

      <OrderManifestModal
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
        order={selectedOrder}
      />

      <DeleteConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={confirmCancel}
        title="Abort Transaction"
        description="Are you sure you want to cancel this order? This will authorize an immediate refund to the customer."
        itemName={selectedOrder?.orderNumber}
      />
    </div>
  )
}
