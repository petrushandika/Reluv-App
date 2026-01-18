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
    <div className="flex flex-col w-full h-full bg-slate-950 text-slate-400 border-none shadow-none ring-0">
      {!hideHeader && (
        <div className="px-4 h-20 flex items-center mb-6">
          {branding || (
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="h-9 w-9 bg-sky-500 rounded-lg flex items-center justify-center border border-slate-800 group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-black text-sm">R</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-tight uppercase leading-none">
                  Reluv
                </span>
                <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.3em] mt-0.5">Control Hub</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar pb-6">
        <div>
          <p className="px-3 mb-4 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Menu</p>
          <nav className="space-y-1">
            {items.filter(i => i.label !== 'Settings').map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border",
                    isActive 
                      ? "bg-sky-500 text-white border-slate-800 shadow-sm" 
                      : "hover:bg-slate-900 hover:text-slate-200 border-transparent hover:border-slate-800"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={cn(
                      "h-4.5 w-4.5 transition-colors",
                      isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                    )} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Platform</p>
          <nav className="space-y-1">
             {items.filter(i => i.label === 'Settings').map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border",
                    isActive 
                      ? "bg-sky-500 text-white border-slate-800 shadow-sm" 
                      : "hover:bg-slate-900 hover:text-slate-200 border-transparent hover:border-slate-800"
                  )}
                >
                  <Icon className={cn(
                    "h-4.5 w-4.5",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                  )} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/50 border border-slate-800/60 transition-all duration-300 hover:bg-slate-900 group">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp" 
                alt="Admin" 
                className="w-8 h-8 rounded-full object-cover transition-all"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-bold text-white truncate group-hover:text-sky-400 transition-colors">Admin Reluv</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1 w-1 rounded-full bg-sky-500 animate-pulse" />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">Pro Terminal</p>
              </div>
            </div>
          </div>
          <button className="p-2 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-all">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
