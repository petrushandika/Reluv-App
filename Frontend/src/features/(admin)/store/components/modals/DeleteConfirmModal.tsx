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
import { AlertTriangle, Trash2 } from "lucide-react"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  itemName?: string
}

export function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  itemName 
}: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-[400px] border-none bg-white dark:bg-slate-900 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-8 space-y-6">
          <AlertDialogHeader className="text-left">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-4">
              <Trash2 className="h-6 w-6 text-rose-500 animate-pulse" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest pt-2">
              {description} {itemName && <span className="text-rose-500 font-bold block mt-2 p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg border border-rose-100 dark:border-rose-500/20">Target: {itemName}</span>}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col sm:flex-row gap-3">
            <AlertDialogCancel 
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all border-none"
            >
              Reconsider
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              className="flex-1 h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 border-none"
            >
              Purge Data
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
