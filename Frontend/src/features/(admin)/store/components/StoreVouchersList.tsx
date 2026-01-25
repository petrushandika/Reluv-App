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
  Ticket,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { VoucherModal } from "./modals/VoucherModal"
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal"

import { useEffect } from "react"
import { toast } from "sonner"
import { getStoreVouchers, deleteStoreVoucher, StoreVoucher } from "../api/storeApi"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function StoreVouchersList() {
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [vouchers, setVouchers] = useState<StoreVoucher[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchVouchers = async () => {
    try {
      setIsLoading(true)
      const data = await getStoreVouchers()
      setVouchers(data)
    } catch (error) {
      console.error("Failed to fetch vouchers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVouchers()
  }, [])

  const handleEdit = (voucher: any) => {
    setSelectedVoucher(voucher)
    setIsEditModalOpen(true)
  }

  const handleDelete = (voucher: any) => {
    setSelectedVoucher(voucher)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedVoucher) return
    try {
      await deleteStoreVoucher(selectedVoucher.id)
      toast.success("Voucher deleted successfully")
      fetchVouchers()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete voucher")
    } finally {
      setIsDeleteModalOpen(false)
    }
  }
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Integrated Search & Filter Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/40">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search campaigns..." 
            className="pl-9 h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-sky-500/10 focus:border-sky-500 rounded-xl text-xs font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[10px] font-medium uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            <Filter className="mr-2 h-3.5 w-3.5" />
            Type
            <ChevronDown className="ml-2 h-3.5 w-3.5" />
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] hidden sm:block whitespace-nowrap">
            {vouchers.length} Rewards Active
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="py-5 pl-8 text-[11px] font-medium uppercase tracking-widest text-slate-400">Campaign Details</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Incentive</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Redemptions</TableHead>
              <TableHead className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-medium uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell className="pr-8 text-right"><Skeleton className="h-8 w-40 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : vouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500 uppercase text-[10px] tracking-widest font-medium">
                  No active campaigns
                </TableCell>
              </TableRow>
            ) : vouchers.map((voucher) => (
              <TableRow 
                key={voucher.id} 
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 border-none"
              >
                <TableCell className="py-5 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-none shrink-0">
                      <Ticket className="h-5 w-5 text-sky-500" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{voucher.name}</span>
                      <span className="text-[10px] font-medium text-slate-400 font-mono uppercase tracking-widest">{voucher.code}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white leading-none">
                      {voucher.type === "PERCENTAGE" ? `${voucher.value}% OFF` : `Rp ${(voucher.value/1000)}k OFF`}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase mt-1 tracking-tighter">Promotional Rate</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5 w-32">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-400 uppercase">Usage</span>
                      <span className="text-[10px] font-medium text-slate-900 dark:text-white">{voucher._count.usages} / {voucher.usageLimit || "∞"}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: voucher.usageLimit ? `${(voucher._count.usages / voucher.usageLimit) * 100}%` : "10%" }}
                        className="h-full bg-sky-500 rounded-full"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center justify-center w-24 px-2.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-widest border border-slate-200 dark:border-slate-800",
                    voucher.isActive ? "text-emerald-500 bg-emerald-500/5" : "text-rose-500 bg-rose-500/5"
                  )}>
                    {voucher.isActive ? "Active" : "Disabled"}
                  </div>
                </TableCell>
                <TableCell className="pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         onClick={() => handleEdit(voucher)}
                         className="h-8 w-16 sm:w-20 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                       >
                         Edit
                       </Button>
                       <Button 
                         variant="ghost" 
                         onClick={() => handleDelete(voucher)}
                         className="h-8 w-16 sm:w-20 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                       >
                         Delete
                       </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Promotion Systems Online</p>
        <div className="flex gap-2">
           <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
             <ChevronLeft className="h-4 w-4 text-slate-500" />
           </Button>
           <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 dark:border-slate-800 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all">
             <ChevronRight className="h-4 w-4 text-sky-500" />
           </Button>
        </div>
      </div>

      <VoucherModal
        isOpen={isEditModalOpen}
        onClose={(refresh) => {
          setIsEditModalOpen(false)
          if (refresh) fetchVouchers()
        }}
        voucher={selectedVoucher}
        mode="edit"
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Burn Campaign"
        description="Are you sure you want to delete this voucher? This will immediately disable the reward for all users."
        itemName={selectedVoucher?.name}
      />
    </div>
  )
}
