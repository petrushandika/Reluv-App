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
import { ShoppingBag, User, MapPin, CreditCard, Clock } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface OrderManifestModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export function OrderManifestModal({ isOpen, onClose, order }: OrderManifestModalProps) {
  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] border-none bg-white dark:bg-slate-900 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <DialogHeader className="p-6 sm:p-8 pb-0 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
              <ShoppingBag className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white uppercase tracking-tight">
                Manifest: {order.orderNumber}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                Transaction finalized on {new Date(order.createdAt).toLocaleDateString()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-slate-400">
                    <User className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Customer Entity</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{order.customer.name}</span>
                    <span className="text-xs text-slate-500">{order.customer.email}</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-slate-400">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Financial Status</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-bold text-sky-500">Rp {order.totalAmount.toLocaleString()}</span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mt-1">Payment Method: Vault Direct</span>
                 </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
               <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Logistics Route</span>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Warehouse 7-B, Distribution Hub 4, Jakarta, ID 10110
               </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
               <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Audit Trail</span>
               </div>
               <div className="space-y-3">
                  {[
                    { time: "10:00", event: "Order Validated", status: "success" },
                    { time: "11:30", event: "Clearing Payment", status: "success" },
                    { time: "14:20", event: "Awaiting Logistics Courier", status: "pending" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 uppercase">{log.event}</span>
                      <div className={cn("h-1.5 w-1.5 rounded-full", log.status === "success" ? "bg-sky-500" : "bg-slate-300")} />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 pt-0 flex justify-end shrink-0">
           <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors h-10 sm:h-12 flex items-center">
              Close Manifest
           </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
