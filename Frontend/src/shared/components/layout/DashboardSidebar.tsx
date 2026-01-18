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
}

export function DashboardSidebar({ items, branding }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0">
      <div className="p-6 h-16 flex items-center justify-start border-b border-gray-200 dark:border-gray-800">
        {branding || (
          <div className="flex flex-col justify-start items-start space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reluv</h1>
          </div>
        )}
      </div>
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
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              )} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center space-x-3">
          <img 
            src="https://ikoverk.com/wp-content/uploads/2025/04/5187871.webp" 
            alt="Administrator" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Administrator</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@reluv.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
