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
  Store,
} from "lucide-react"
import { StoreListItem } from "../api/superadminApi"
import { useState } from "react"

interface SuperadminStoresListProps {
  stores: StoreListItem[]
  onStatusChange?: (storeId: number, data: { isActive?: boolean; isVerified?: boolean }) => void
}

export function SuperadminStoresList({ stores, onStatusChange }: SuperadminStoresListProps) {
  const [loadingStoreId, setLoadingStoreId] = useState<number | null>(null)

  const handleStatusChange = async (
    storeId: number,
    data: { isActive?: boolean; isVerified?: boolean }
  ) => {
    setLoadingStoreId(storeId)
    try {
      await onStatusChange?.(storeId, data)
    } finally {
      setLoadingStoreId(null)
    }
  }

  const getStatusBadge = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) {
      return (
        <Badge 
          variant="outline" 
          className="text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1"
        >
          Inactive
        </Badge>
      )
    }
    if (!isVerified) {
      return (
        <Badge 
          variant="outline" 
          className="text-amber-600 border-amber-100 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1"
        >
          Pending
        </Badge>
      )
    }
    return (
      <Badge 
        variant="outline" 
        className="text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1"
      >
        Verified
      </Badge>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[200px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pl-6">Store</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Owner</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Products</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sales</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rating</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Store className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No stores found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            stores.map((store) => (
              <TableRow 
                key={store.id} 
                className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <TableCell className="py-4 pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center shrink-0">
                      {store.profile?.avatar ? (
                        <img 
                          src={store.profile.avatar} 
                          alt={store.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <Store className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {store.name}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate">
                        /{store.slug}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {store.user?.firstName && store.user?.lastName
                        ? `${store.user.firstName} ${store.user.lastName}`
                        : store.user?.email || "N/A"}
                    </span>
                    {store.user?.email && (
                      <span className="text-[10px] text-slate-400 truncate">
                        {store.user.email}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {store.totalProducts}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {store.totalSales}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {store.rating ? store.rating.toFixed(1) : "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(store.isActive, store.isVerified)}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => window.open(`/store/${store.slug}`, "_blank")}
                      className="h-8 w-16 sm:w-20 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                    >
                      View
                    </Button>
                    {!store.isVerified && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleStatusChange(store.id, { isVerified: true })}
                        disabled={loadingStoreId === store.id}
                        className="h-8 w-16 sm:w-20 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                      >
                        Verify
                      </Button>
                    )}
                    {store.isVerified && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleStatusChange(store.id, { isVerified: false })}
                        disabled={loadingStoreId === store.id}
                        className="h-8 w-16 sm:w-20 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                      >
                        Unverify
                      </Button>
                    )}
                    {store.isActive && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleStatusChange(store.id, { isActive: false })}
                        disabled={loadingStoreId === store.id}
                        className="h-8 w-16 sm:w-20 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                      >
                        Deactivate
                      </Button>
                    )}
                    {!store.isActive && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleStatusChange(store.id, { isActive: true })}
                        disabled={loadingStoreId === store.id}
                        className="h-8 w-16 sm:w-20 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

