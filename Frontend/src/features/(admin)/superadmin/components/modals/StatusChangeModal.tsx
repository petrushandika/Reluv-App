"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface StatusOption {
  id: string
  label: string
  icon: any
  color: string
  bg: string
  description: string
}

interface StatusChangeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (status: string) => void
  currentStatus: string
  itemName: string
  title: string
  options: StatusOption[]
}

export function StatusChangeModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentStatus,
  itemName,
  title,
  options
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = React.useState<string>(currentStatus)

  React.useEffect(() => {
    if (isOpen) setSelectedStatus(currentStatus)
  }, [isOpen, currentStatus])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-none bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">
            Updating status for {itemName}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 sm:p-8 space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Select new status</p>
          <div className="grid gap-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedStatus(option.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                  selectedStatus === option.id 
                    ? "border-sky-500 bg-sky-50/50 dark:bg-sky-500/5 ring-1 ring-sky-500" 
                    : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-950"
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${option.bg}`}>
                  <option.icon className={`h-4 w-4 ${option.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold ${selectedStatus === option.id ? "text-sky-600 dark:text-sky-400" : "text-slate-700 dark:text-slate-300"}`}>
                      {option.label}
                    </p>
                    {selectedStatus === option.id && (
                      <CheckCircle2 className="h-4 w-4 text-sky-500" />
                    )}
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 mt-1 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <DialogFooter className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl text-slate-500 hover:text-slate-700 font-bold text-[11px] uppercase tracking-widest"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(selectedStatus)}
            disabled={selectedStatus === currentStatus}
            className="flex-1 h-12 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-sky-500/20"
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
