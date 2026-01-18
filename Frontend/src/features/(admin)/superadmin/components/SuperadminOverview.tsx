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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rp. ${value.toLocaleString("id-ID")}`}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">{payload[0].payload.name}</p>
                  <p className="text-sm font-bold text-sky-600 dark:text-sky-400">{`GMV: Rp. ${payload[0].value.toLocaleString("id-ID")}`}</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{`Users: ${payload[1].value.toLocaleString("id-ID")}`}</p>
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
