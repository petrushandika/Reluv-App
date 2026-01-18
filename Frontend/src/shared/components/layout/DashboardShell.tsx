"use client"

import { StoreSearch } from "@/features/(admin)/store/components/StoreSearch"
import { StoreUserNav } from "@/features/(admin)/store/components/StoreUserNav"
import { SuperadminSearch } from "@/features/(admin)/superadmin/components/SuperadminSearch"
import { SuperadminUserNav } from "@/features/(admin)/superadmin/components/SuperadminUserNav"
import { DashboardSidebar } from "./DashboardSidebar"
import { LucideIcon, Menu } from "lucide-react"
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
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-gray-950">
      {/* Sidebar Desktop */}
      <DashboardSidebar items={sidebarItems} branding={branding} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen md:ml-64">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 fixed top-0 right-0 left-0 md:left-64 z-40 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
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
        <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between md:hidden">
               <div className="flex items-center space-x-2">
                 {actions}
               </div>
            </div>
            
            <div className="hidden md:flex items-center justify-between">
               <div className="space-y-1">
                 {/* Optional subtitle could go here */}
               </div>
               <div className="flex items-center space-x-2">
                 {actions}
               </div>
            </div>

            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay (Simple Implementation) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="w-64 h-full bg-white dark:bg-gray-950">
             <DashboardSidebar items={sidebarItems} branding={branding} />
          </div>
        </div>
      )}
    </div>
  )
}
