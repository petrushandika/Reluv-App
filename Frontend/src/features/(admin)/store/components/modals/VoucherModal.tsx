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

import { useState, useEffect } from "react"
import { createStoreVoucher, updateStoreVoucher } from "../../api/storeApi"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface VoucherModalProps {
  isOpen: boolean
  onClose: (refresh?: boolean) => void
  voucher?: any
  mode: "create" | "edit"
}

export function VoucherModal({ isOpen, onClose, voucher, mode }: VoucherModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT",
    value: 0,
    usageLimit: 0,
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  })

  useEffect(() => {
    if (voucher && mode === "edit") {
      setFormData({
        name: voucher.name,
        code: voucher.code,
        type: voucher.type,
        value: voucher.value,
        usageLimit: voucher.usageLimit || 0,
        expiry: voucher.expiry
      })
    } else {
      setFormData({
        name: "",
        code: "",
        type: "PERCENTAGE",
        value: 0,
        usageLimit: 0,
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
    }
  }, [voucher, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const payload = {
        ...formData,
        value: Number(formData.value),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined
      }

      if (mode === "create") {
        await createStoreVoucher(payload)
        toast.success("Voucher created")
      } else {
        await updateStoreVoucher(voucher.id, payload)
        toast.success("Voucher updated")
      }
      onClose(true)
    } catch (error: any) {
      toast.error(error.message || "Failed to save voucher")
    } finally {
      setIsSaving(false)
    }
  }

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
          <form id="voucher-form" onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Campaign Name</Label>
                <Input 
                  required
                  placeholder="e.g. Lunar New Year Special" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Promo Code</Label>
                  <Input 
                    required
                    placeholder="LUNAR2024" 
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</Label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl px-4 text-sm focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (IDR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reward Value</Label>
                  <div className="relative">
                    <Input 
                      required
                      type="number" 
                      placeholder="0"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
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
                    value={formData.usageLimit || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                    className="h-11 sm:h-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Expiration Cycle</Label>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 italic">Current Expiry</span>
                  <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">
                    {new Date(formData.expiry).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 shrink-0">
          <Button variant="ghost" onClick={() => onClose()} className="rounded-xl px-4 sm:px-6 h-11 sm:h-12 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500 flex-1 sm:flex-none">
            Hold
          </Button>
          <Button 
            form="voucher-form"
            type="submit"
            disabled={isSaving}
            className="rounded-xl px-6 sm:px-8 h-11 sm:h-12 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all flex-1 sm:flex-none"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "create" ? "Launch" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
