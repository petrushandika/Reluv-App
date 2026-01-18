"use client"

import { StoreSearch } from "@/features/(admin)/store/components/StoreSearch"
import { StoreUserNav } from "@/features/(admin)/store/components/StoreUserNav"
import { SuperadminSearch } from "@/features/(admin)/superadmin/components/SuperadminSearch"
import { SuperadminUserNav } from "@/features/(admin)/superadmin/components/SuperadminUserNav"
import { DashboardSidebar } from "./DashboardSidebar"
import { LucideIcon, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"

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
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-950 overflow-x-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 h-screen fixed left-0 top-0 z-50">
        <DashboardSidebar items={sidebarItems} branding={branding} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md fixed top-0 right-0 left-0 md:left-64 z-40 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            {type === "store" ? (
              <>
                <StoreSearch />
                <StoreUserNav />
              </>
            ) : (
              <>
                <SuperadminSearch />
                <SuperadminUserNav />
              </>
            )}
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 md:p-8 mt-16 dashboard-scroll">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header for Mobile/Tablet */}
            <div className="flex items-center justify-between md:hidden mb-2">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
               <div className="flex items-center space-x-2">
                 {actions}
               </div>
            </div>
            
            {/* Header for Desktop */}
            <div className="hidden md:flex items-center justify-between">
               <div className="space-y-1">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
               </div>
               <div className="flex items-center space-x-2">
                 {actions}
               </div>
            </div>

            <div className="animate-in fade-in duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 md:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 w-72 h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-300">
             <div className="h-full flex flex-col">
               <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                 <span className="text-2xl font-bold text-slate-900 dark:text-white">Reluv</span>
                 <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                   <X className="h-5 w-5" />
                 </Button>
               </div>
               <div className="flex-1 overflow-y-auto">
                 <DashboardSidebar items={sidebarItems} branding={null} hideHeader={true} />
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
