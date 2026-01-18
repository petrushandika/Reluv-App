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
  Truck, 
  CheckCircle2, 
  Clock, 
  User,
  MoreVertical
} from "lucide-react"

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
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="h-3 w-3 mr-1" />;
      case "PAID": return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "SHIPPED": return <Truck className="h-3 w-3 mr-1" />;
      case "DELIVERED": return <CheckCircle2 className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

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
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[200px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4">Order ID</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Items</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-slate-100 dark:border-slate-800/60 hover:bg-sky-50/30 dark:hover:bg-sky-500/5 transition-colors group">
              <TableCell className="py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">#{order.orderNumber.split('-')[1]}</span>
                  <span className="text-[10px] text-slate-400 font-medium">#{order.orderNumber}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{order.customer.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{order.customer.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {order.itemCount} Items
                </div>
              </TableCell>
              <TableCell className="font-bold text-sm text-slate-900 dark:text-white">
                Rp. {order.totalAmount.toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-bold text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 border-2 rounded-full flex items-center w-fit",
                    getStatusColor(order.status)
                  )}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end space-x-1.5">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 border border-transparent hover:border-sky-100 dark:hover:border-sky-900/30 rounded-xl transition-all">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-500/10 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-xl transition-all">
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
