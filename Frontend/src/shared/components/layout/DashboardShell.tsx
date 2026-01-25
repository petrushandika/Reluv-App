"use client"

import { StoreSearch } from "@/features/(admin)/store/components/StoreSearch"
import { StoreUserNav } from "@/features/(admin)/store/components/StoreUserNav"
import { SuperadminSearch } from "@/features/(admin)/superadmin/components/SuperadminSearch"
import { SuperadminUserNav } from "@/features/(admin)/superadmin/components/SuperadminUserNav"
import { DashboardSidebar } from "./DashboardSidebar"
import { LucideIcon, Menu, X, Bell, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import { motion } from "framer-motion"

interface SidebarItem {
  label: string
  href: string
  icon: LucideIcon
}

interface DashboardShellProps {
  children: React.ReactNode
  sidebarItems: SidebarItem[]
  title: string
  actions?: React.ReactNode
  branding?: React.ReactNode
  type: "store" | "superadmin"
}

export function DashboardShell({
  children,
  sidebarItems,
  title,
  actions,
  branding,
  type,
}: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen w-full bg-(--bg-primary) overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar Desktop - Fixed width, solid column */}
      <aside className="hidden lg:flex flex-col w-[280px] border-r border-(--border-color) bg-(--bg-primary) shrink-0 h-full transition-colors duration-300">
        <DashboardSidebar items={sidebarItems} branding={branding} />
      </aside>

      {/* Main Container - Takes remaining space, manages its own scroll */}
      <div className="flex-1 flex flex-col relative min-w-0 h-full bg-(--bg-secondary)/10">
        {/* Top Header - Sticky inside main container */}
        <header className="h-16 shrink-0 bg-(--bg-primary) border-b border-(--border-color) flex items-center justify-between px-4 sm:px-8 z-30 transition-colors duration-300">
          <div className="flex items-center gap-2 sm:gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-500 hover:bg-(--bg-secondary) rounded-lg h-9 w-9"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="hidden xs:flex items-center space-x-2 text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">
              <span className="hidden sm:inline">Portal</span>
              <ChevronRight className="h-3 w-3 hidden sm:inline" />
              <span className="text-sky-500 truncate max-w-[100px] sm:max-w-none">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
             <div className="hidden lg:flex items-center gap-2">
               <StoreSearch />
             </div>

            <div className="flex items-center space-x-1 p-1 bg-(--bg-secondary) rounded-full border border-(--border-color) h-9 sm:h-10">
               <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-slate-500 hover:text-sky-500 hover:bg-(--bg-primary) transition-all relative">
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-1.5 w-1.5 bg-sky-500 rounded-full ring-2 ring-(--bg-primary)" />
              </Button>
              <div className="h-4 w-px bg-(--border-color) mx-0.5 sm:mx-1" />
              {type === "store" ? <StoreUserNav /> : <SuperadminUserNav />}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar">
          <div className="w-full max-w-[1600px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div>
                  <h1 className="text-xl sm:text-3xl font-medium text-(--text-primary) tracking-tight uppercase">
                    {title}
                  </h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {actions}
                </div>
            </div>

            <div className="pb-20">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="absolute left-0 top-0 w-[280px] h-full bg-(--bg-primary) border-r border-(--border-color) z-110"
          >
             <div className="h-full flex flex-col">
               <div className="h-20 flex items-center justify-between px-4 border-b border-(--border-color) bg-(--bg-primary)">
                 <div className="flex items-center gap-3">
                   <div className="h-9 w-9 bg-sky-500 rounded-lg flex items-center justify-center border border-(--border-color)">
                     <span className="text-white font-medium text-xs">R</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-lg font-medium text-(--text-primary) uppercase tracking-tight leading-none">Reluv</span>
                     <span className="text-[7px] font-medium text-slate-600 uppercase tracking-[0.3em]">Control Hub</span>
                   </div>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 hover:text-white">
                   <X className="h-5 w-5" />
                 </Button>
               </div>
               <div className="flex-1 overflow-y-auto pt-4">
                 <DashboardSidebar items={sidebarItems} branding={null} hideHeader={true} />
               </div>
             </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
