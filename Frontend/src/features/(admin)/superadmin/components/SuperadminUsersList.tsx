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
  Store,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Shield,
  UserCheck
} from "lucide-react"
import { UserListItem } from "../api/superadminApi"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

interface SuperadminUsersListProps {
  users: UserListItem[]
  onStatusChange?: (userId: number, data: { isActive?: boolean; isVerified?: boolean; role?: "USER" | "ADMIN" | "STORE" }) => void
}

export function SuperadminUsersList({ users, onStatusChange }: SuperadminUsersListProps) {
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null)

  const handleStatusChange = async (
    userId: number,
    data: { isActive?: boolean; isVerified?: boolean; role?: "USER" | "ADMIN" | "STORE" }
  ) => {
    setLoadingUserId(userId)
    try {
      await onStatusChange?.(userId, data)
    } finally {
      setLoadingUserId(null)
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
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {user.email}
                      </span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                          {user.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell>
                  {user.store ? (
                    <div className="flex items-center space-x-2">
                      <Store className="h-3.5 w-3.5 text-sky-500" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                          {user.store.name}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          /{user.store.slug}
                        </span>
                      </div>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                        disabled={loadingUserId === user.id}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 dark:border-slate-800">
                      <DropdownMenuItem 
                        className="flex items-center gap-2 cursor-pointer rounded-lg"
                        onClick={() => window.open(`/profile/${user.id}`, "_blank")}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-xs font-medium">View Profile</span>
                      </DropdownMenuItem>
                      {!user.isVerified && (
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer rounded-lg text-emerald-600"
                          onClick={() => handleStatusChange(user.id, { isVerified: true })}
                          disabled={loadingUserId === user.id}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs font-medium">Verify User</span>
                        </DropdownMenuItem>
                      )}
                      {user.isVerified && (
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer rounded-lg text-amber-600"
                          onClick={() => handleStatusChange(user.id, { isVerified: false })}
                          disabled={loadingUserId === user.id}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Unverify User</span>
                        </DropdownMenuItem>
                      )}
                      {user.isActive && (
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer rounded-lg text-rose-600"
                          onClick={() => handleStatusChange(user.id, { isActive: false })}
                          disabled={loadingUserId === user.id}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Deactivate</span>
                        </DropdownMenuItem>
                      )}
                      {!user.isActive && (
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer rounded-lg text-emerald-600"
                          onClick={() => handleStatusChange(user.id, { isActive: true })}
                          disabled={loadingUserId === user.id}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs font-medium">Activate</span>
                        </DropdownMenuItem>
                      )}
                      {user.role !== "ADMIN" && (
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer rounded-lg text-violet-600"
                          onClick={() => handleStatusChange(user.id, { role: "ADMIN" })}
                          disabled={loadingUserId === user.id}
                        >
                          <Shield className="h-4 w-4" />
                          <span className="text-xs font-medium">Make Admin</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

