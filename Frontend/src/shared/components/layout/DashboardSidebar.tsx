"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/utils"
import { LucideIcon } from "lucide-react"

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
    <div className="flex flex-col w-full h-full bg-white dark:bg-slate-950">
      {!hideHeader && (
        <div className="p-6 h-16 flex items-center justify-start border-b border-slate-200 dark:border-slate-800">
          {branding || (
            <div className="flex flex-col justify-start items-start space-y-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reluv</h1>
            </div>
          )}
        </div>
      )}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-sky-50 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400"
                  : "text-slate-500 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-sky-600 dark:text-sky-400" : "text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400"
              )} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center space-x-3">
          <img 
            src="https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp" 
            alt="Administrator" 
            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Administrator</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@reluv.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
