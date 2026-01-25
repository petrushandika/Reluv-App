"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select } from "@/shared/components/ui/select"
import { Ticket, Percent, Banknote } from "lucide-react"

interface VoucherModalProps {
  isOpen: boolean
  onClose: () => void
  voucher?: any
  mode: "create" | "edit"
}

export function VoucherModal({ isOpen, onClose, voucher, mode }: VoucherModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] border-none bg-white dark:bg-slate-900 p-0 overflow-hidden rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <DialogHeader className="p-6 sm:p-8 pb-0 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Ticket className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white uppercase tracking-tight">
                {mode === "create" ? "Create Promo" : "Adjust Campaign"}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                Configure promotional reward
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Campaign Name</Label>
                <Input 
                  placeholder="e.g. Lunar New Year Special" 
                  defaultValue={voucher?.name}
                  className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Promo Code</Label>
                  <Input 
                    placeholder="LUNAR2024" 
                    defaultValue={voucher?.code}
                    className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</Label>
                  <Select defaultValue={voucher?.type || "PERCENTAGE"}>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (IDR)</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reward Value</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="0"
                      defaultValue={voucher?.value}
                      className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl pl-9"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                       <span className="text-xs font-bold text-slate-400 italic">...</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Usage Limit</Label>
                  <Input 
                    type="number" 
                    placeholder="Unlimited"
                    defaultValue={voucher?.usageLimit}
                    className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Expiration Cycle</Label>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 italic">Ends in</span>
                  <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">30 Days</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 shrink-0">
          <Button variant="ghost" onClick={onClose} className="rounded-xl px-4 sm:px-6 h-11 sm:h-12 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500 flex-1 sm:flex-none">
            Hold
          </Button>
          <Button onClick={onClose} className="rounded-xl px-6 sm:px-8 h-11 sm:h-12 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all flex-1 sm:flex-none">
            {mode === "create" ? "Launch" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
