"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Badge } from "@/shared/components/ui/badge"
import { StoreListItem } from "../../api/superadminApi"
import { Store, User, Package, ShoppingBag, Star, Calendar } from "lucide-react"

interface StoreViewModalProps {
  isOpen: boolean
  onClose: () => void
  store: StoreListItem | null
}

export function StoreViewModal({ isOpen, onClose, store }: StoreViewModalProps) {
  if (!store) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-none bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            Store Details
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Complete store information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="h-16 w-16 rounded-lg bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center shrink-0">
              {store.profile?.avatar ? (
                <img 
                  src={store.profile.avatar} 
                  alt={store.name}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <Store className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{store.name}</h3>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
                /{store.slug}
              </p>
              <div className="mt-3">
                {store.isActive && store.isVerified ? (
                  <Badge className="text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1">
                    Verified
                  </Badge>
                ) : !store.isActive ? (
                  <Badge className="text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1">
                    Inactive
                  </Badge>
                ) : (
                  <Badge className="text-amber-600 border-amber-100 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1">
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{store.totalProducts}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sales</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{store.totalSales}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {store.rating ? store.rating.toFixed(1) : "N/A"}
              </p>
            </div>
          </div>

          {store.user && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Owner</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {store.user.firstName && store.user.lastName
                    ? `${store.user.firstName} ${store.user.lastName}`
                    : "N/A"}
                </p>
                <p className="text-xs font-medium text-slate-400">{store.user.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created: {new Date(store.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

