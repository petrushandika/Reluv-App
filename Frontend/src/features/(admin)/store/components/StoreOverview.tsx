"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 1700 },
  { name: "Jun", total: 2800 },
  { name: "Jul", total: 3200 },
  { name: "Aug", total: 2900 },
  { name: "Sep", total: 3500 },
  { name: "Oct", total: 3100 },
  { name: "Nov", total: 3800 },
  { name: "Dec", total: 4200 },
]

export function StoreOverview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
          cursor={{fill: 'transparent'}}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-gray-800 p-2 border rounded shadow-sm border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{`Revenue: Rp. ${payload[0].value.toLocaleString("id-ID")}`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
