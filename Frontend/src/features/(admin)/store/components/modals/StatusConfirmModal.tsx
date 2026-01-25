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


interface StatusConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  itemName?: string
  currentStatus: string
}

export function StatusConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  itemName,
  currentStatus
}: StatusConfirmModalProps) {
  const isActivating = currentStatus !== 'active';
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-[400px] border-none bg-white dark:bg-slate-900 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-8 space-y-6">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest pt-2">
              {description} 
              {itemName && (
                <span className={`font-bold block mt-2 p-2 rounded-lg border 
                  ${isActivating ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' : 'text-slate-600 bg-slate-50 dark:bg-slate-500/10 border-slate-100 dark:border-slate-500/20'}`}>
                  Target: {itemName}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col sm:flex-row gap-3">
            <AlertDialogCancel 
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              className={`flex-1 h-12 rounded-xl text-white shadow-lg text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 border-none
                ${isActivating 
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                  : 'bg-slate-500 hover:bg-slate-600 shadow-slate-500/20'}`}
            >
              {isActivating ? "Activate" : "Deactivate"}
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
