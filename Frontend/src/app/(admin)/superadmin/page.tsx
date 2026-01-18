"use client"

import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { DashboardShell } from "@/shared/components/layout/DashboardShell"
import { SuperadminOverview } from "@/features/(admin)/superadmin/components/SuperadminOverview"
import { SuperadminActivity } from "@/features/(admin)/superadmin/components/SuperadminActivity"
import { 
  ShieldAlert, 
  Users, 
  Store, 
  Activity, 
  LayoutDashboard, 
  Tag, 
  BarChart3, 
  Settings2,
  AlertTriangle
} from "lucide-react"

const sidebarItems = [
  {
    label: "Platform Overview",
    href: "/superadmin",
    icon: LayoutDashboard,
  },
  {
    label: "Store Management",
    href: "/superadmin/stores",
    icon: Store,
  },
  {
    label: "User base",
    href: "/superadmin/users",
    icon: Users,
  },
  {
    label: "Global Categories",
    href: "/superadmin/categories",
    icon: Tag,
  },
  {
    label: "Analytics",
    href: "/superadmin/analytics",
    icon: BarChart3,
  },
  {
    label: "System Settings",
    href: "/superadmin/settings",
    icon: Settings2,
  },
]

export default function SuperadminDashboardPage() {
  return (
    <DashboardShell 
      title="Admin Control Center" 
      sidebarItems={sidebarItems}
      type="superadmin"
      branding={
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Superadmin</h1>
      }
      actions={
        <Button variant="destructive" size="sm" className="shadow-lg shadow-red-500/20">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Maintenance Mode
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-md bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global GMV</CardTitle>
              <Activity className="h-4 w-4 text-red-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,432,231.00</div>
              <p className="text-xs text-green-500 font-medium">+5.2% <span className="text-muted-foreground font-normal">from last cycle</span></p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Store className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+1,284</div>
              <p className="text-xs text-amber-600 font-medium">12 pending verification</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+42,231</div>
              <p className="text-xs text-blue-500 font-medium">+1,200 new this week</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Latency</CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42ms</div>
              <p className="text-xs text-muted-foreground">Region: Southeast Asia</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-none shadow-lg bg-white dark:bg-gray-900 overflow-hidden">
            <CardHeader className="border-b border-gray-50 dark:border-gray-800">
              <CardTitle className="text-lg">Platform Growth</CardTitle>
              <CardDescription>Network-wide user and revenue trends.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pt-6">
              <SuperadminOverview />
            </CardContent>
          </Card>
          <Card className="col-span-3 border-none shadow-lg bg-white dark:bg-gray-900 overflow-hidden">
            <CardHeader className="border-b border-gray-50 dark:border-gray-800">
              <CardTitle className="text-lg">System Activity</CardTitle>
              <CardDescription>Real-time updates from across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SuperadminActivity />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
