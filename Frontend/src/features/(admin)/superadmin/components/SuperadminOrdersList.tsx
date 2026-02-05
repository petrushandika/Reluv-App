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
  User,
  ShoppingBag,
  MoreVertical,
  Store,
  ExternalLink
} from "lucide-react"

const orders = [
  {
    id: "ORD-001",
    orderNumber: "ORD-20240118-001",
    customer: "John Doe",
    store: "Reluv Official",
    totalAmount: 1250000,
    status: "PAID",
    createdAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "ORD-002",
    orderNumber: "ORD-20240117-005",
    customer: "Alice Smith",
    store: "Vintage Hub",
    totalAmount: 450000,
    status: "SHIPPED",
    createdAt: "2024-01-17T15:30:00Z",
  },
  {
    id: "ORD-003",
    orderNumber: "ORD-20240117-002",
    customer: "Bob Knight",
    store: "Reluv Official",
    totalAmount: 2100000,
    status: "DELIVERED",
    createdAt: "2024-01-17T09:15:00Z",
  },
]

export function SuperadminOrdersList() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-600 border-amber-100 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-900/30";
      case "PAID": return "text-sky-600 border-sky-100 bg-sky-50 dark:bg-sky-500/10 dark:border-sky-900/30";
      case "SHIPPED": return "text-blue-600 border-blue-100 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-900/30";
      case "DELIVERED": return "text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30";
      case "CANCELLED": return "text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30";
      default: return "text-slate-500 border-slate-100 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[180px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pl-6">Order ID</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Store</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Amount</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
              <TableCell className="py-4 pl-6">
                <span className="text-xs font-bold text-slate-900 dark:text-white">#{order.orderNumber}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{order.customer}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Store className="h-3.5 w-3.5 text-sky-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{order.store}</span>
                </div>
              </TableCell>
              <TableCell className="font-bold text-xs text-slate-900 dark:text-white">
                Rp. {order.totalAmount.toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-bold text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-full",
                    getStatusColor(order.status)
                  )}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-600 rounded-xl border border-transparent hover:border-sky-100 dark:hover:border-sky-900/30">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-xl">
                    <MoreVertical className="h-4 w-4" />
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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
