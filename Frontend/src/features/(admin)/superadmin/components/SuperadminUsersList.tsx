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
  User,
} from "lucide-react"
import { UserListItem } from "../api/superadminApi"
import { useState } from "react"
import { UserViewModal } from "./modals/UserViewModal"
import { StatusConfirmModal } from "./modals/StatusConfirmModal"

interface SuperadminUsersListProps {
  users: UserListItem[]
  onStatusChange?: (userId: number, data: { isActive?: boolean; isVerified?: boolean; role?: "USER" | "ADMIN" | "STORE" }) => void
}

export function SuperadminUsersList({ users, onStatusChange }: SuperadminUsersListProps) {
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [statusAction, setStatusAction] = useState<{ type: "verify" | "unverify" | "activate" | "deactivate" | "makeAdmin", userId: number } | null>(null)

  const handleView = (user: UserListItem) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleStatusClick = (user: UserListItem, type: "verify" | "unverify" | "activate" | "deactivate" | "makeAdmin") => {
    setSelectedUser(user)
    setStatusAction({ type, userId: user.id })
    setIsStatusModalOpen(true)
  }

  const confirmStatusChange = async () => {
    if (!statusAction || !selectedUser) return
    setLoadingUserId(statusAction.userId)
    try {
      const data: { isActive?: boolean; isVerified?: boolean; role?: "USER" | "ADMIN" | "STORE" } = {}
      if (statusAction.type === "verify") data.isVerified = true
      if (statusAction.type === "unverify") data.isVerified = false
      if (statusAction.type === "activate") data.isActive = true
      if (statusAction.type === "deactivate") data.isActive = false
      if (statusAction.type === "makeAdmin") data.role = "ADMIN"
      await onStatusChange?.(statusAction.userId, data)
    } finally {
      setLoadingUserId(null)
      setIsStatusModalOpen(false)
      setStatusAction(null)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge 
            variant="outline" 
            className="text-violet-600 border-violet-100 bg-violet-50 dark:bg-violet-500/10 dark:border-violet-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1"
          >
            Admin
          </Badge>
        )
      case "STORE":
        return (
          <Badge 
            variant="outline" 
            className="text-sky-600 border-sky-100 bg-sky-50 dark:bg-sky-500/10 dark:border-sky-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1"
          >
            Store
          </Badge>
        )
      default:
        return (
          <Badge 
            variant="outline" 
            className="text-slate-600 border-slate-100 bg-slate-50 dark:bg-slate-500/10 dark:border-slate-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1"
          >
            User
          </Badge>
        )
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
          Unverified
        </Badge>
      )
    }
    return (
      <Badge 
        variant="outline" 
        className="text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1"
      >
        Active
      </Badge>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[200px] text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pl-6">User</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Contact</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Role</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Store</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Joined</TableHead>
            <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No users found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow 
                key={user.id} 
                className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <TableCell className="py-4 pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-900/30 flex items-center justify-center shrink-0">
                      {user.profile?.avatar ? (
                        <img 
                          src={user.profile.avatar} 
                          alt={user.email}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.email.split("@")[0]}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1 min-w-0">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {user.email}
                    </span>
                    {user.phone && (
                      <span className="text-[10px] text-slate-400 truncate">
                        {user.phone}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell>
                  {user.store ? (
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {user.store.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        /{user.store.slug}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">No store</span>
                  )}
                </TableCell>
                <TableCell>
                  {getStatusBadge(user.isActive, user.isVerified)}
                </TableCell>
                <TableCell>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleView(user)}
                      className="h-8 w-16 sm:w-20 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                    >
                      View
                    </Button>
                    {!user.isVerified && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleStatusClick(user, "verify")}
                        disabled={loadingUserId === user.id}
                        className="h-8 w-16 sm:w-20 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                      >
                        Verify
                      </Button>
                    )}
                    {user.isVerified && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleStatusClick(user, "unverify")}
                        disabled={loadingUserId === user.id}
                        className="h-8 w-16 sm:w-20 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                      >
                        Unverify
                      </Button>
                    )}
                    {user.isActive && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleStatusClick(user, "deactivate")}
                        disabled={loadingUserId === user.id}
                        className="h-8 w-16 sm:w-20 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                      >
                        Deactivate
                      </Button>
                    )}
                    {!user.isActive && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleStatusClick(user, "activate")}
                        disabled={loadingUserId === user.id}
                        className="h-8 w-16 sm:w-20 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                      >
                        Activate
                      </Button>
                    )}
                    {user.role !== "ADMIN" && (
                      <Button 
                        variant="ghost" 
                        onClick={() => handleStatusClick(user, "makeAdmin")}
                        disabled={loadingUserId === user.id}
                        className="h-8 w-16 sm:w-20 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 hover:text-violet-700 hover:bg-violet-100 dark:hover:bg-violet-500/20 text-[10px] font-medium uppercase tracking-widest transition-all"
                      >
                        Make Admin
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <UserViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
      />

      <StatusConfirmModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setStatusAction(null)
        }}
        onConfirm={confirmStatusChange}
        title={statusAction?.type === "verify" ? "Verify User" : statusAction?.type === "unverify" ? "Unverify User" : statusAction?.type === "activate" ? "Activate User" : statusAction?.type === "deactivate" ? "Deactivate User" : "Make Admin"}
        description={statusAction?.type === "verify" 
          ? "Are you sure you want to verify this user? This will mark their account as verified."
          : statusAction?.type === "unverify"
          ? "Are you sure you want to unverify this user? This will remove their verified status."
          : statusAction?.type === "activate"
          ? "Are you sure you want to activate this user? They will be able to access the platform."
          : statusAction?.type === "deactivate"
          ? "Are you sure you want to deactivate this user? They will lose access to the platform."
          : "Are you sure you want to make this user an admin? They will have full administrative privileges."}
        itemName={selectedUser?.email}
        actionType={statusAction?.type || "verify"}
      />
    </div>
  )
}
