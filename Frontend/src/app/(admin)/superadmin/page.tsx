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
  Activity, 
  AlertTriangle,
  Store,
  Users
} from "lucide-react"
import { superadminSidebarItems } from "@/features/(admin)/superadmin/constants/sidebarItems"

export default function SuperadminDashboardPage() {
  return (
    <DashboardShell 
      title="Overview" 
      sidebarItems={superadminSidebarItems}
      type="superadmin"
      branding={
        <h1 className="text-2xl font-medium text-(--text-primary)">Superadmin</h1>
      }
      actions={
        <div className="flex items-center w-full sm:w-auto">
          <Button variant="outline" size="sm" className="bg-(--bg-secondary) border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-(--bg-primary) transition-all font-medium rounded-xl h-9 sm:h-10 px-3 sm:px-4 text-[10px] sm:text-xs w-full sm:w-auto">
            <AlertTriangle className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">Maintenance Mode</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-emerald-200 dark:hover:border-emerald-900/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Global GMV</CardTitle>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-900/20 group-hover:bg-emerald-100 transition-colors">
                <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium text-slate-900 dark:text-white">Rp. 1.432.231.000</div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center bg-emerald-50 dark:bg-emerald-500/10 w-fit px-1.5 py-0.5 rounded">
                +5.2% from last cycle
              </p>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-blue-200 dark:hover:border-blue-900/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Total Stores</CardTitle>
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-900/20 group-hover:bg-blue-100 transition-colors">
                <Store className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium text-slate-900 dark:text-white">+1,284</div>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center bg-amber-50 dark:bg-amber-500/10 w-fit px-1.5 py-0.5 rounded uppercase tracking-wider">
                12 pending verification
              </p>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:border-violet-200 dark:hover:border-violet-900/50 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Active Users</CardTitle>
              <div className="p-2 bg-violet-50 dark:bg-violet-500/10 rounded-lg border border-violet-100 dark:border-violet-900/20 group-hover:bg-violet-100 transition-colors">
                <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium text-slate-900 dark:text-white">+42,231</div>
              <p className="text-[10px] text-violet-600 dark:text-violet-400 font-medium mt-1 uppercase tracking-wider">+1,200 new this week</p>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">API Latency</CardTitle>
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium text-slate-900 dark:text-white">42ms</div>
              <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-widest">Region: SE Asia</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-7">
          {}
          <Card className="lg:col-span-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all">
            <CardHeader className="flex flex-col xs:flex-row items-start xs:items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50 gap-4">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">Platform Growth</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                  Network-wide performance across all regions
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-end xs:self-auto">
                <button className="px-3 py-1.5 text-[9px] font-medium uppercase tracking-widest bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-600">All Regions</button>
                <button className="px-3 py-1.5 text-[9px] font-medium uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">SEA</button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 p-4 sm:p-6">
              <div className="h-[300px] sm:h-[350px] w-full">
                <SuperadminOverview />
              </div>
            </CardContent>
          </Card>

          {}
          <Card className="lg:col-span-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all overflow-hidden flex flex-col">
            <CardHeader className="px-4 sm:px-6 py-4 border-b border-slate-50 dark:border-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-slate-900 dark:text-white uppercase tracking-widest">System Activity</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                    Real-time network events
                  </CardDescription>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                  <Activity className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[450px]">
              <div className="px-6 py-6 flex-1 overflow-y-auto scrollbar-hide">
                <SuperadminActivity />
              </div>
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">24 New Events</p>
                <button className="text-xs font-medium text-sky-500 hover:text-sky-600 transition-colors flex items-center">
                  Open Security Console
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
