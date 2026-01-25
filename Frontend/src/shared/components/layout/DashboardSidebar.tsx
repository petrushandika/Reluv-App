"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/utils"
import { LucideIcon, LogOut, ChevronRight, Zap, User, Shield, Sparkles, Settings as SettingsIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/features/(auth)/store/auth.store"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

interface SidebarItem {
  label: string
  href: string
  icon: LucideIcon
}

interface DashboardSidebarProps {
  items: SidebarItem[]
  branding?: React.ReactNode
  hideHeader?: boolean
}

export function DashboardSidebar({ items, branding, hideHeader }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const name = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Reluv Admin"
  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "RA" : "RA"
  const avatar = user?.profile?.avatar || "https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp"
  const roleLabel = user?.role === "ADMIN" ? "Pro Terminal" : "Store Manager"
  const settingsPath = user?.role === "ADMIN" ? "/superadmin" : "/store/settings"

  return (
    <div className="flex flex-col w-full h-full bg-(--bg-primary) text-(--text-secondary) shadow-none ring-0">
      {!hideHeader && (
        <div className="px-4 h-20 flex items-center mb-6">
          {branding || (
            <div className="flex items-center space-x-3 group cursor-pointer text-(--text-primary)">
              <div className="h-9 w-9 bg-sky-500 rounded-lg flex items-center justify-center border border-(--border-color) group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-medium text-sm">R</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-medium tracking-tight uppercase leading-none">
                  Reluv
                </span>
                <span className="text-[7px] font-medium text-slate-500 uppercase tracking-[0.3em] mt-1 overflow-hidden">Control Hub</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar pb-6">
        <div>
          <p className="px-3 mb-4 text-[10px] font-medium text-slate-500 uppercase tracking-[0.2em]">Menu</p>
          <nav className="space-y-1">
            {items.filter(i => i.label !== 'Settings').map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                    isActive 
                      ? "bg-sky-500 text-white border-sky-400/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]" 
                      : "hover:bg-(--bg-secondary) hover:text-sky-500 border-transparent hover:border-(--border-color)"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-white" : "text-slate-500 group-hover:text-sky-400"
                    )} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 mb-4 text-[10px] font-medium text-slate-500 uppercase tracking-[0.2em]">Platform</p>
          <nav className="space-y-1">
             {items.filter(i => i.label === 'Settings').map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                    isActive 
                      ? "bg-sky-500 text-white border-sky-400/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]" 
                      : "hover:bg-(--bg-secondary) hover:text-sky-500 border-transparent hover:border-(--border-color)"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-sky-400"
                  )} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-(--border-color)">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-(--bg-secondary) border border-(--border-color) transition-all duration-300 hover:bg-(--bg-primary) group cursor-pointer active:scale-[0.98]">
              <div className="flex items-center space-x-3">
                <div className="relative group/avatar">
                  <img 
                    src={avatar} 
                    alt={name} 
                    className="w-9 h-9 rounded-full object-cover transition-all ring-2 ring-(--border-color) group-hover/avatar:ring-sky-500 group-hover:grayscale-0 grayscale"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-(--bg-primary) shadow-sm" />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs font-medium text-(--text-primary) truncate transition-colors">{name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-1 w-1 rounded-full bg-sky-500 animate-pulse" />
                    <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest truncate">{roleLabel}</p>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-sky-500 transition-colors" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mb-4 rounded-2xl p-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl" side="right" align="end" sideOffset={12}>
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-2">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Account Hub</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{name}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
            <DropdownMenuGroup className="p-1">
              <DropdownMenuItem asChild>
                <Link href={settingsPath} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all">
                     <User className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs font-medium text-slate-900 dark:text-white">Profile Overview</span>
                     <span className="text-[9px] text-slate-400 uppercase tracking-tight">Identity & Bio</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
                   <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-medium text-slate-900 dark:text-white">Advanced Flows</span>
                   <span className="text-[9px] text-slate-400 uppercase tracking-tight">System Synced</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 transition-colors group m-1">
               <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 group-hover:bg-rose-500 group-hover:text-white transition-all">
                  <LogOut className="h-4 w-4" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-medium">Terminate Session</span>
                  <span className="text-[9px] text-rose-400 uppercase tracking-tight">Sign out securely</span>
               </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
