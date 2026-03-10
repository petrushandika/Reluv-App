"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Shield, Store, User, CheckCircle2 } from "lucide-react"

interface RoleChangeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (role: "USER" | "ADMIN" | "STORE") => void
  currentRole: string
  userName: string
}

export function RoleChangeModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentRole,
  userName 
}: RoleChangeModalProps) {
  const [selectedRole, setSelectedRole] = React.useState<"USER" | "ADMIN" | "STORE">(currentRole as any)

  React.useEffect(() => {
    if (isOpen) setSelectedRole(currentRole as any)
  }, [isOpen, currentRole])

  const roles = [
    { id: "USER", label: "User", icon: User, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-500/10", border: "border-slate-100 dark:border-slate-800" },
    { id: "STORE", label: "Store", icon: Store, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-500/10", border: "border-sky-100 dark:border-sky-800" },
    { id: "ADMIN", label: "Admin", icon: Shield, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-500/10", border: "border-violet-100 dark:border-violet-800" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-none bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            Change User Role
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">
            Updating role for {userName}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 sm:p-8 space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Select new role</p>
          <div className="grid gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as any)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  selectedRole === role.id 
                    ? "border-sky-500 bg-sky-50/50 dark:bg-sky-500/5 ring-1 ring-sky-500" 
                    : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${role.bg}`}>
                    <role.icon className={`h-4 w-4 ${role.color}`} />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold ${selectedRole === role.id ? "text-sky-600 dark:text-sky-400" : "text-slate-700 dark:text-slate-300"}`}>
                      {role.label}
                    </p>
                  </div>
                </div>
                {selectedRole === role.id && (
                  <CheckCircle2 className="h-5 w-5 text-sky-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl text-slate-500 hover:text-slate-700 font-bold text-[11px] uppercase tracking-widest"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(selectedRole)}
            disabled={selectedRole === currentRole}
            className="flex-1 h-12 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-sky-500/20"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
