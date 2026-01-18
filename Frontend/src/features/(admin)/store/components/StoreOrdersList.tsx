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
  User,
  Truck,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { motion } from "framer-motion"

const orders = [
  {
    id: "ORD-001",
    orderNumber: "ORD-20240118-001",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com"
    },
    totalAmount: 1250000,
    status: "PAID",
    createdAt: "2024-01-18T10:00:00Z",
    itemCount: 2,
  },
  {
    id: "ORD-002",
    orderNumber: "ORD-20240117-005",
    customer: {
      name: "Alice Smith",
      email: "alice@email.com"
    },
    totalAmount: 450000,
    status: "SHIPPED",
    createdAt: "2024-01-17T15:30:00Z",
    itemCount: 1,
  },
  {
    id: "ORD-003",
    orderNumber: "ORD-20240117-002",
    customer: {
      name: "Bob Knight",
      email: "bob.k@gmail.com"
    },
    totalAmount: 2100000,
    status: "DELIVERED",
    createdAt: "2024-01-17T09:15:00Z",
    itemCount: 3,
  },
  {
    id: "ORD-004",
    orderNumber: "ORD-20240116-012",
    customer: {
      name: "Sarah Parker",
      email: "sarah.p@example.com"
    },
    totalAmount: 850000,
    status: "PENDING",
    createdAt: "2024-01-16T11:45:00Z",
    itemCount: 1,
  },
  {
    id: "ORD-005",
    orderNumber: "ORD-20240115-008",
    customer: {
      name: "Michael Brown",
      email: "m.brown@email.com"
    },
    totalAmount: 3200000,
    status: "CANCELLED",
    createdAt: "2024-01-15T14:20:00Z",
    itemCount: 4,
  },
]

export function StoreOrdersList() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-500 bg-amber-500/5"
      case "PAID": return "text-sky-500 bg-sky-500/5"
      case "SHIPPED": return "text-indigo-500 bg-indigo-500/5"
      case "DELIVERED": return "text-emerald-500 bg-emerald-500/5"
      case "CANCELLED": return "text-rose-500 bg-rose-500/5"
      default: return "text-slate-500 bg-slate-500/5"
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Integrated Search & Filter Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/40">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search orders..." 
            className="pl-9 h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-sky-500/10 focus:border-sky-500 rounded-xl text-xs font-bold"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            <Filter className="mr-2 h-3.5 w-3.5" />
            Category
            <ChevronDown className="ml-2 h-3.5 w-3.5" />
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:block whitespace-nowrap">
            {orders.length} Records Found
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="py-5 pl-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Order ID</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-400">Customer</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-400">Value</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-400">Lifecycle</TableHead>
              <TableHead className="text-right pr-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.map((order) => (
              <TableRow 
                key={order.id} 
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-200 border-none"
              >
                <TableCell className="py-5 pl-8">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{order.orderNumber}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{order.customer.name}</span>
                      <span className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]">{order.customer.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                      Rp {(order.totalAmount / 1000).toLocaleString()}k
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{order.itemCount} Items</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-800",
                    getStatusStyle(order.status)
                  )}>
                    {order.status}
                  </div>
                </TableCell>
                <TableCell className="pr-8">
                   <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" className="h-8 px-3 rounded-lg text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-500/10 text-[10px] font-black uppercase tracking-widest transition-all">
                        View
                      </Button>
                      <Button variant="ghost" className="h-8 px-3 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest transition-all">
                        Cancel
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Feed Active</p>
        <div className="flex gap-2">
           <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
             <ChevronLeft className="h-4 w-4 text-slate-500" />
           </Button>
           <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200 dark:border-slate-800 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all">
             <ChevronRight className="h-4 w-4 text-sky-500" />
           </Button>
        </div>
      </div>
    </div>
  )
}
