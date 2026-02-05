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
import { UserListItem } from "../../api/superadminApi"
import { User, Mail, Phone, Store, Shield, Calendar } from "lucide-react"

interface UserViewModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserListItem | null
}

export function UserViewModal({ isOpen, onClose, user }: UserViewModalProps) {
  if (!user) return null

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="text-violet-600 border-violet-100 bg-violet-50 dark:bg-violet-500/10 dark:border-violet-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1">
            Admin
          </Badge>
        )
      case "STORE":
        return (
          <Badge className="text-sky-600 border-sky-100 bg-sky-50 dark:bg-sky-500/10 dark:border-sky-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1">
            Store
          </Badge>
        )
      default:
        return (
          <Badge className="text-slate-600 border-slate-100 bg-slate-50 dark:bg-slate-500/10 dark:border-slate-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1">
            User
          </Badge>
        )
    }
  }

  const getStatusBadge = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) {
      return (
        <Badge className="text-rose-600 border-rose-100 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1">
          Inactive
        </Badge>
      )
    }
    if (!isVerified) {
      return (
        <Badge className="text-amber-600 border-amber-100 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1">
          Unverified
        </Badge>
      )
    }
    return (
      <Badge className="text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1">
        Active
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-none bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            User Details
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-slate-400 uppercase tracking-widest">
            Complete user information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="h-16 w-16 rounded-lg bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center shrink-0">
              {user.profile?.avatar ? (
                <img 
                  src={user.profile.avatar} 
                  alt={user.email}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-sky-600 dark:text-sky-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email.split("@")[0]}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-1">{user.email}</p>
              <div className="flex gap-2 mt-3">
                {getRoleBadge(user.role)}
                {getStatusBadge(user.isActive, user.isVerified)}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-3">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {user.store && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <Store className="h-4 w-4 text-sky-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Store</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user.store.name}</p>
                <p className="text-xs font-medium text-slate-400">/{user.store.slug}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Joined: {new Date(user.createdAt).toLocaleDateString("id-ID", {
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

