"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 42000 },
  { month: "Feb", sales: 48000 },
  { month: "Mar", sales: 44000 },
  { month: "Apr", sales: 56000 },
  { month: "May", sales: 61000 },
  { month: "Jun", sales: 68000 },
  { month: "Jul", sales: 74000 },
];

export default function SalesOverview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Sales Overview
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Monthly sales performance
          </p>
        </div>

        <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none">
          <option>Last 7 months</option>
          <option>Last 12 months</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={salesData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                `${value / 1000}k`
              }
            />

            <Tooltip
              formatter={(value) => [
                `৳${Number(value).toLocaleString()}`,
                "Sales",
              ]}
            />

            <Area
              type="monotone"
              dataKey="sales"
              strokeWidth={2}
              fillOpacity={0.12}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}