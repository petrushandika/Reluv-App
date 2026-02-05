"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Badge } from "@/shared/components/ui/badge"
import { User, Store, Calendar, Package } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface OrderViewModalProps {
  isOpen: boolean
  onClose: () => void
  order: {
    id: string
    orderNumber: string
    customer: string
    store: string
    totalAmount: number
    status: string
    createdAt: string
  } | null
}

export function OrderViewModal({ isOpen, onClose, order }: OrderViewModalProps) {
  if (!order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-600 border-amber-100 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-900/30"
      case "PAID": return "text-sky-600 border-sky-100 bg-sky-50 dark:bg-sky-500/10 dark:border-sky-900/30"
      case "SHIPPED": return "text-blue-600 border-blue-100 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-900/30"
      case "DELIVERED": return "text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30"
      case "CANCELLED": return "text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30"
      default: return "text-slate-500 border-slate-100 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-none bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            Order Details
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Complete order information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">#{order.orderNumber}</h3>
                <p className="text-xs font-medium text-slate-400 mt-1">Order ID: {order.id}</p>
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  "font-bold text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-full",
                  getStatusColor(order.status)
                )}
              >
                {order.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{order.customer}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-4 w-4 text-sky-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Store</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{order.store}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              Rp {order.totalAmount.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created: {new Date(order.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

