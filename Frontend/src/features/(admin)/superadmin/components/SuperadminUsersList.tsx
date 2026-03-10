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
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Plus
} from "lucide-react"
import Image from "next/image"
import { UserListItem } from "../api/superadminApi"
import { useState } from "react"
import { UserViewModal } from "./modals/UserViewModal"
import { RoleChangeModal } from "./modals/RoleChangeModal"
import { StatusChangeModal } from "./modals/StatusChangeModal"

interface SuperadminUsersListProps {
  users: UserListItem[]
  onStatusChange?: (userId: number, data: { isActive?: boolean; isVerified?: boolean; role?: "USER" | "ADMIN" | "STORE" }) => void
}

export function SuperadminUsersList({ users, onStatusChange }: SuperadminUsersListProps) {
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  const handleView = (user: UserListItem) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const handleRoleClick = (user: UserListItem) => {
    setSelectedUser(user)
    setIsRoleModalOpen(true)
  }

  const handleStatusClick = (user: UserListItem) => {
    setSelectedUser(user)
    setIsStatusModalOpen(true)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge 
            variant="outline" 
            className="text-violet-600 border-violet-100 bg-violet-50 dark:bg-violet-500/10 dark:border-violet-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1 block w-fit shadow-xs cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-all"
          >
            Admin
          </Badge>
        )
      case "STORE":
        return (
          <Badge 
            variant="outline" 
            className="text-sky-600 border-sky-100 bg-sky-50 dark:bg-sky-500/10 dark:border-sky-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1 block w-fit shadow-xs cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-all"
          >
            Store
          </Badge>
        )
      default:
        return (
          <Badge 
            variant="outline" 
            className="text-slate-600 border-slate-100 bg-slate-50 dark:bg-slate-500/10 dark:border-slate-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1 block w-fit shadow-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-500/20 transition-all"
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
          Unverified
        </Badge>
      )
    }
    return (
      <Badge 
        variant="outline" 
        className="text-emerald-600 border-emerald-100 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-900/30 uppercase text-[9px] font-bold tracking-[0.2em] px-2 py-1 block w-fit shadow-xs cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
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
            <TableHead className="w-[200px] text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4 pl-6">User</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Contact</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Role</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Store</TableHead>
            <TableHead className="w-[80px] text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 py-4">View</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Joined</TableHead>
            <TableHead className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-12 text-center">
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
                        <div className="relative h-full w-full">
                          <Image 
                            src={user.profile.avatar} 
                            alt={user.email}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <User className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
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
                <TableCell className="text-left">
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
                <TableCell className="text-center">
                  <div className="flex justify-center" onClick={() => handleRoleClick(user)}>
                    {getRoleBadge(user.role)}
                  </div>
                </TableCell>
                <TableCell className="text-left">
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
                <TableCell className="py-4 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(user)}
                    className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-all mx-auto"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center" onClick={() => handleStatusClick(user)}>
                    {getStatusBadge(user.isActive, user.isVerified)}
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
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

      <UserViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
      />

      <RoleChangeModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={(role) => {
          if (selectedUser) {
            onStatusChange?.(selectedUser.id, { role })
            setIsRoleModalOpen(false)
          }
        }}
        currentRole={selectedUser?.role || "USER"}
        userName={selectedUser?.email || ""}
      />

      <StatusChangeModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={(status) => {
          if (selectedUser) {
            const data: { isActive?: boolean; isVerified?: boolean } = {}
            if (status === "ACTIVE") { data.isActive = true; data.isVerified = true; }
            if (status === "INACTIVE") { data.isActive = false; }
            if (status === "UNVERIFIED") { data.isActive = true; data.isVerified = false; }
            onStatusChange?.(selectedUser.id, data)
            setIsStatusModalOpen(false)
          }
        }}
        currentStatus={selectedUser?.isActive ? (selectedUser.isVerified ? "ACTIVE" : "UNVERIFIED") : "INACTIVE"}
        itemName={selectedUser?.email || ""}
        title="Account Status"
        options={[
          { id: "ACTIVE", label: "Active", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", description: "User can access all platform features normally." },
          { id: "UNVERIFIED", label: "Unverified", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10", description: "Account is active but requires verification." },
          { id: "INACTIVE", label: "Inactive", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-500/10", description: "User is disabled and cannot login." },
        ]}
      />
    </div>
  )
}
