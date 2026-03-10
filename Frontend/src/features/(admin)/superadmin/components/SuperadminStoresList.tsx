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
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus
} from "lucide-react"
import Image from "next/image"
import { StoreListItem } from "../api/superadminApi"
import { useState } from "react"
import { StoreViewModal } from "./modals/StoreViewModal"
import { StatusChangeModal } from "./modals/StatusChangeModal"

interface SuperadminStoresListProps {
  stores: StoreListItem[]
  onStatusChange?: (storeId: number, data: { isActive?: boolean; isVerified?: boolean }) => void
}

export function SuperadminStoresList({ stores, onStatusChange }: SuperadminStoresListProps) {
  const [selectedStore, setSelectedStore] = useState<StoreListItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  const handleView = (store: StoreListItem) => {
    setSelectedStore(store)
    setIsViewModalOpen(true)
  }

  const handleStatusClick = (store: StoreListItem) => {
    setSelectedStore(store)
    setIsStatusModalOpen(true)
  }

  const getStatusBadge = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) {
      return (
        <Badge 
          variant="outline" 
          className="text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1 block w-fit shadow-xs cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
        >
          Inactive
        </Badge>
      )
    }
    if (!isVerified) {
      return (
        <Badge 
          variant="outline" 
          className="text-amber-600 border-amber-100 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1 block w-fit shadow-xs cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
        >
          Pending
        </Badge>
      )
    }
    return (
      <Badge 
        variant="outline" 
        className="text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1 block w-fit shadow-xs cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
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
            <TableHead className="w-[200px] text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pl-6">Store</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Owner</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Products</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Sales</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Rating</TableHead>
            <TableHead className="w-[80px] text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4">View</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-12 text-center">
                <p className="text-sm font-medium text-slate-500">No stores found</p>
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
                        <div className="relative h-full w-full">
                          <Image 
                            src={store.profile.avatar} 
                            alt={store.name}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <Store className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {store.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        /{store.slug}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {store.user?.firstName && store.user?.lastName
                        ? `${store.user.firstName} ${store.user.lastName}`
                        : store.user?.email || "N/A"}
                    </span>
                    {store.user?.email && (
                      <span className="text-[10px] text-slate-400 truncate text-left">
                        {store.user.email}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {store.totalProducts}
                  </span>
                </TableCell>
                <TableCell className="text-center font-bold text-xs text-slate-900 dark:text-white">
                  {store.totalSales}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {store.rating ? store.rating.toFixed(1) : "0.0"}
                    </span>
                    <span className="text-[10px] text-amber-500">★</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(store)}
                    className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-all mx-auto"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center" onClick={() => handleStatusClick(store)}>
                    {getStatusBadge(store.isActive, store.isVerified)}
                  </div>
                </TableCell>
                <TableCell className="text-center pr-6">
                  <div className="flex items-center justify-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <StoreViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedStore(null)
        }}
        store={selectedStore}
      />

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setSelectedStore(null)
        }}
        onConfirm={(status) => {
          if (selectedStore) {
            const data: any = {}
            if (status === "VERIFIED") { data.isActive = true; data.isVerified = true; }
            if (status === "PENDING") { data.isActive = true; data.isVerified = false; }
            if (status === "INACTIVE") { data.isActive = false; }
            onStatusChange?.(selectedStore.id, data)
            setIsStatusModalOpen(false)
          }
        }}
        currentStatus={selectedStore?.isVerified ? "VERIFIED" : (selectedStore?.isActive ? "PENDING" : "INACTIVE")}
        itemName={selectedStore?.name || ""}
        title="Store Status"
        options={[
          { id: "VERIFIED", label: "Verified", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", description: "Store is active and officially verified. Can sell products normally." },
          { id: "PENDING", label: "Pending", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10", description: "Store is awaiting verification review by the team." },
          { id: "INACTIVE", label: "Inactive", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10", description: "Store is deactivated and products are hidden from the public." },
        ]}
      />
    </div>
  )
}
