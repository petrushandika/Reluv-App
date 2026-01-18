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
  Trash2, 
  Edit, 
  Ticket, 
  Calendar,
  MoreVertical,
  Activity,
  ArrowRight
} from "lucide-react"
import { cn } from "@/shared/lib/utils"

const mockVouchers = [
  {
    id: 1,
    name: "New Year Sale",
    code: "NY2024",
    type: "PERCENTAGE",
    value: 15,
    maxDiscount: 50000,
    minPurchase: 200000,
    usageCount: 45,
    usageLimit: 100,
    expiry: "2024-12-31T23:59:59Z",
    isActive: true,
  },
  {
    id: 2,
    name: "Welcome Bonus",
    code: "WELCOME10",
    type: "FIXED_AMOUNT",
    value: 10000,
    maxDiscount: null,
    minPurchase: 50000,
    usageCount: 128,
    usageLimit: 500,
    expiry: "2024-06-30T23:59:59Z",
    isActive: true,
  },
  {
    id: 3,
    name: "Flash Sale Friday",
    code: "FLASHFRIDAY",
    type: "PERCENTAGE",
    value: 20,
    maxDiscount: 30000,
    minPurchase: 100000,
    usageCount: 200,
    usageLimit: 200,
    expiry: "2024-01-15T23:59:59Z",
    isActive: false,
  },
]

export function StoreVouchersList() {
  const getVoucherTypeLabel = (type: string) => {
    return type === "PERCENTAGE" ? "Percentage" : "Fixed Amount"
  }

  const getStatusColor = (isActive: boolean, expiry: string, usageCount: number, usageLimit: number | null) => {
    const isExpired = new Date(expiry) < new Date()
    const isFull = usageLimit ? usageCount >= usageLimit : false

    if (!isActive) return "text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30"
    if (isExpired) return "text-slate-400 border-slate-100 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700"
    if (isFull) return "text-amber-600 border-amber-100 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-900/30"
    return "text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30"
  }

  const getStatusLabel = (isActive: boolean, expiry: string, usageCount: number, usageLimit: number | null) => {
    const isExpired = new Date(expiry) < new Date()
    const isFull = usageLimit ? usageCount >= usageLimit : false

    if (!isActive) return "Inactive"
    if (isExpired) return "Expired"
    if (isFull) return "Fully Used"
    return "Active"
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-none">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[220px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pl-6">Voucher Info</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Discount</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Usage</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Expiry</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockVouchers.map((voucher) => (
            <TableRow key={voucher.id} className="border-slate-100 dark:border-slate-800/60 hover:bg-sky-50/30 dark:hover:bg-sky-500/5 transition-all group">
              <TableCell className="py-5 pl-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Ticket className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">{voucher.name}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded w-fit mt-1">{voucher.code}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {voucher.type === "PERCENTAGE" ? `${voucher.value}%` : `Rp. ${voucher.value.toLocaleString("id-ID")}`}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">
                    {voucher.minPurchase ? `Min. Rp. ${voucher.minPurchase.toLocaleString("id-ID")}` : "No min. order"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1.5 min-w-[120px]">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-900 dark:text-white">{voucher.usageCount} used</span>
                    <span className="text-slate-400">{voucher.usageLimit || "∞"} limit</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700">
                    <div 
                      className="h-full bg-sky-500 transition-all duration-500" 
                      style={{ width: voucher.usageLimit ? `${(voucher.usageCount / voucher.usageLimit) * 100}%` : "10%" }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-slate-400" />
                  {new Date(voucher.expiry).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  className={cn(
                    "font-bold text-[9px] uppercase tracking-widest px-3 py-1 border-2 rounded-full",
                    getStatusColor(voucher.isActive, voucher.expiry, voucher.usageCount, voucher.usageLimit)
                  )}
                >
                  {getStatusLabel(voucher.isActive, voucher.expiry, voucher.usageCount, voucher.usageLimit)}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end space-x-1.5">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 border border-transparent hover:border-sky-100 dark:hover:border-sky-900/30 rounded-xl transition-all">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 rounded-xl transition-all">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
