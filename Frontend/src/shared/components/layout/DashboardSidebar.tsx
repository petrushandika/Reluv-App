"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/utils"
import { LucideIcon, LogOut, ChevronRight, Zap } from "lucide-react"
import { motion } from "framer-motion"

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
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-(--bg-secondary) border border-(--border-color) transition-all duration-300 hover:bg-(--bg-primary) group">
          <div className="flex items-center space-x-3">
            <div className="relative group/avatar">
              <img 
                src="https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp" 
                alt="Admin" 
                className="w-9 h-9 rounded-full object-cover transition-all ring-2 ring-(--border-color) group-hover/avatar:ring-sky-500 group-hover:grayscale-0 grayscale"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-(--bg-primary) shadow-sm" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-medium text-(--text-primary) truncate transition-colors">Admin Reluv</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1 w-1 rounded-full bg-sky-500 animate-pulse" />
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest truncate">Pro Terminal</p>
              </div>
            </div>
          </div>
          <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
