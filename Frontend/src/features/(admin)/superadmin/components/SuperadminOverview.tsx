"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { name: "Week 1", users: 400, gmv: 2400 },
  { name: "Week 2", users: 700, gmv: 4500 },
  { name: "Week 3", users: 1100, gmv: 7800 },
  { name: "Week 4", users: 1800, gmv: 12000 },
  { name: "Week 5", users: 2500, gmv: 18500 },
  { name: "Week 6", users: 3200, gmv: 24000 },
]

export function SuperadminOverview() {
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
                <div className="bg-(--bg-primary) p-4 border rounded-2xl shadow-2xl border-(--border-color) backdrop-blur-xl">
                  <p className="text-[10px] text-slate-500 mb-2 font-medium uppercase tracking-widest">{payload[0].payload.name}</p>
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-sky-500 flex items-center justify-between gap-4">
                      <span className="text-slate-400 font-medium uppercase text-[9px]">GMV</span>
                      {`Rp. ${payload[0].value.toLocaleString("id-ID")}`}
                    </p>
                    <p className="text-sm font-medium text-emerald-500 flex items-center justify-between gap-4">
                      <span className="text-slate-400 font-medium uppercase text-[9px]">Users</span>
                      {payload[1].value.toLocaleString("id-ID")}
                    </p>
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
