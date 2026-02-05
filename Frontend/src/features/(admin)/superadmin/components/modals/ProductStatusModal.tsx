"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"

interface ProductStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  actionType: "approve" | "reject"
  productName?: string
}

export function ProductStatusModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  actionType,
  productName
}: ProductStatusModalProps) {
  const getTitle = () => {
    return actionType === "approve" ? "Approve Product" : "Reject Product"
  }

  const getDescription = () => {
    if (actionType === "approve") {
      return "Are you sure you want to approve this product? It will be visible to customers and available for purchase."
    }
    return "Are you sure you want to reject this product? It will be removed from the platform and the store owner will be notified."
  }

  const getActionColor = () => {
    return actionType === "approve" 
      ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
      : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-[400px] border-none bg-white dark:bg-slate-900 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="space-y-4">
          <AlertDialogHeader className="flex flex-col gap-2 text-center sm:text-left px-6 pt-8 pb-0 sm:px-8 sm:pt-10 sm:pb-0 shrink-0">
            <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              {getTitle()}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest pt-2">
              {getDescription()} 
              {productName && (
                <span className="font-bold block mt-2 p-2 rounded-lg border text-slate-600 bg-slate-50 dark:bg-slate-500/10 border-slate-100 dark:border-slate-500/20">
                  Product: {productName}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col sm:flex-row gap-3 px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
            <AlertDialogCancel 
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-sky-100 dark:border-sky-900/30 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-500/10 bg-white dark:bg-slate-950 text-[11px] font-bold uppercase tracking-widest transition-all"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              className={`flex-1 h-12 rounded-xl text-white shadow-lg text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 border-none ${getActionColor()}`}
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

