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
import { 
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  Plus
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { useState } from "react"
import { OrderViewModal } from "./modals/OrderViewModal"
import { StatusChangeModal } from "./modals/StatusChangeModal"

interface SuperadminOrdersListProps {
  orders: any[]
  onStatusChange?: (orderId: number, status: string) => void
}

export function SuperadminOrdersList({ orders, onStatusChange }: SuperadminOrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  const handleView = (order: any) => {
    setSelectedOrder(order)
    setIsViewModalOpen(true)
  }

  const handleStatusClick = (order: any) => {
    setSelectedOrder(order)
    setIsStatusModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-600 border-amber-100 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-900/30";
      case "PAID": return "text-sky-600 border-sky-100 bg-sky-50 dark:bg-sky-500/10 dark:border-sky-900/30";
      case "SHIPPED": return "text-blue-600 border-blue-100 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-900/30";
      case "DELIVERED": return "text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30";
      case "CANCELLED": return "text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30";
      case "COMPLETED": return "text-emerald-700 border-emerald-200 bg-emerald-100 dark:bg-emerald-500/20 dark:border-emerald-900/40";
      default: return "text-slate-500 border-slate-100 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[180px] text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pl-6">Order ID</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Amount</TableHead>
            <TableHead className="w-[80px] text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4">View</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center">
                <p className="text-sm font-medium text-slate-500">No orders found</p>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id} className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <TableCell className="py-4 pl-6 text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">#{order.orderNumber}</span>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {order.buyer?.firstName} {order.buyer?.lastName}
                    </span>
                    <span className="text-[10px] text-slate-400">{order.buyer?.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center font-bold text-xs text-slate-900 dark:text-white">
                  Rp. {order.totalAmount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(order)}
                    className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-all mx-auto"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center cursor-pointer" onClick={() => handleStatusClick(order)}>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-bold text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-full block w-fit hover:opacity-80 transition-all",
                        getStatusColor(order.status)
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-left text-xs font-bold text-slate-700 dark:text-slate-300">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </TableCell>
                <TableCell className="text-center pr-6">
                  <div className="flex items-center justify-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <OrderViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
      />

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setSelectedOrder(null)
        }}
        onConfirm={(status) => {
          if (selectedOrder) {
            onStatusChange?.(selectedOrder.id, status)
            setIsStatusModalOpen(false)
          }
        }}
        currentStatus={selectedOrder?.status || "PENDING"}
        itemName={selectedOrder?.orderNumber ? `#${selectedOrder.orderNumber}` : ""}
        title="Order Status"
        options={[
          { id: "PENDING", label: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10", description: "Order has been placed but not yet paid or processed." },
          { id: "PAID", label: "Paid", icon: CheckCircle2, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-500/10", description: "Payment received. Ready for processing." },
          { id: "PROCESSING", label: "Processing", icon: Package, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10", description: "Order is being prepared for shipment." },
          { id: "SHIPPED", label: "Shipped", icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-500/10", description: "Order has been dispatched." },
          { id: "DELIVERED", label: "Delivered", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", description: "Order reached final destination." },
          { id: "COMPLETED", label: "Completed", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-100 dark:bg-emerald-500/20", description: "Order finalized and satisfied." },
          { id: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10", description: "Order has been terminated." },
        ]}
      />
    </div>
  )
}
