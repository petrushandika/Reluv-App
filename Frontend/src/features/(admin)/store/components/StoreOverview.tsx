"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

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
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1}/>
            <stop offset="100%" stopColor="#0284c7" stopOpacity={0.8}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
        <XAxis
          dataKey="name"
          stroke="#94a3b8"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          dy={10}
          fontWeight={500}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rp. ${(value / 1000)}k`}
          dx={-10}
          fontWeight={500}
        />
        <Tooltip 
          cursor={{fill: '#f1f5f9', opacity: 0.4}}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 rounded-xl shadow-none">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-1">{label}</p>
                  <p className="text-lg font-medium text-sky-600 dark:text-sky-400">
                    {`Rp. ${payload[0].value?.toLocaleString("id-ID")}`}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="total"
          fill="url(#colorTotal)"
          radius={[6, 6, 0, 0]}
          barSize={28}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
