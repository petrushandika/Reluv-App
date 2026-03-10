"use client"

import * as React from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { getAnalytics, AnalyticsData } from "../api/superadminApi"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function SuperadminOverview() {
  const [data, setData] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const analytics = await getAnalytics({ timeRange: "30d", period: "day" })
        
        // Merge revenue and user charts based on date
        const chartData = analytics.revenueChart.map((rev) => {
          const userPoint = analytics.userChart.find((u) => u.date === rev.date)
          return {
            name: new Date(rev.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
            gmv: rev.amount,
            users: userPoint ? userPoint.count : 0
          }
        })
        
        setData(chartData)
      } catch (error) {
        console.error("Failed to fetch analytics chart:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return <Skeleton className="w-full h-[350px] rounded-2xl" />
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
        <XAxis
          dataKey="name"
          stroke="#94a3b8"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rp. ${value.toLocaleString("id-ID")}`}
          dx={-10}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-slate-900 p-4 border rounded-2xl shadow-2xl border-slate-100 dark:border-slate-800 backdrop-blur-xl">
                  <p className="text-[10px] text-slate-500 mb-2 font-medium uppercase tracking-widest">{payload[0].payload.name}</p>
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-sky-500 flex items-center justify-between gap-4">
                      <span className="text-slate-400 font-medium uppercase text-[9px]">GMV</span>
                      {`Rp. ${payload[0].value.toLocaleString("id-ID")}`}
                    </p>
                    {payload[1] && (
                      <p className="text-sm font-medium text-emerald-500 flex items-center justify-between gap-4">
                        <span className="text-slate-400 font-medium uppercase text-[9px]">Users</span>
                        {payload[1].value.toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line 
          type="monotone" 
          dataKey="gmv" 
          stroke="#3b82f6" 
          strokeWidth={2} 
          dot={{ r: 4, fill: "#3b82f6" }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="users" 
          stroke="#10b981" 
          strokeWidth={2} 
          dot={{ r: 4, fill: "#10b981" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
