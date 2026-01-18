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
import { StoreOverview } from "@/features/(admin)/store/components/StoreOverview"
import { StoreRecentSales } from "@/features/(admin)/store/components/StoreRecentSales"
import { 
  Download, 
  Plus, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Ticket, 
  Settings,
  Star
} from "lucide-react"

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/store",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/store/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/store/orders",
    icon: ShoppingCart,
  },
  {
    label: "Vouchers",
    href: "/store/vouchers",
    icon: Ticket,
  },
  {
    label: "Reviews",
    href: "/store/reviews",
    icon: Star,
  },
  {
    label: "Settings",
    href: "/store/settings",
    icon: Settings,
  },
]

export default function StoreDashboardPage() {
  return (
    <DashboardShell 
      title="Store Analytics" 
      sidebarItems={sidebarItems}
      type="store"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Revenue</CardTitle>
              <div className="h-4 w-4 text-primary opacity-70">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,431.89</div>
              <p className="text-xs text-green-500 font-medium">+12.1% <span className="text-muted-foreground font-normal">from last month</span></p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="h-4 w-4 text-primary opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+45</div>
              <p className="text-xs text-muted-foreground">2 drafts awaiting approval</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8 / 5.0</div>
              <p className="text-xs text-muted-foreground">Based on 128 verified reviews</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Order Velocity</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12</div>
              <p className="text-xs text-muted-foreground">4 orders need shipment today</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-none shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
            <CardHeader className="border-b border-gray-50 dark:border-gray-800">
              <CardTitle className="text-lg">Sales Revenue</CardTitle>
              <CardDescription>Monthly performance trend for the current year.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pt-6">
              <StoreOverview />
            </CardContent>
          </Card>
          <Card className="col-span-3 border-none shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
            <CardHeader className="border-b border-gray-50 dark:border-gray-800">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <CardDescription>You have 12 orders waiting to be processed.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <StoreRecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
