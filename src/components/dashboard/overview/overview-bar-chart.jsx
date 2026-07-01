"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tabs = ["Merchant", "Reseller", "Payment Gateway"];

const chartConfig = {
  Merchant: {
    title: "GMV trend — Onboarded vs Active",
    primaryKey: "onboarded",
    secondaryKey: "active",
    primaryLabel: "Onboarded GMV",
    secondaryLabel: "Active GMV",
    primaryLight: "#9db8f5",
    primaryDark: "#2D4CC8",
    secondaryLight: "#8ee4cf",
    secondaryDark: "#25a36f",
    data: [
      { month: "Jan", onboarded: 52, active: 44 },
      { month: "Feb", onboarded: 58, active: 49 },
      { month: "Mar", onboarded: 61, active: 53 },
      { month: "Apr", onboarded: 64, active: 56 },
      { month: "May", onboarded: 68, active: 60 },
      { month: "Jun", onboarded: 72, active: 63 },
      { month: "Jul", onboarded: 80, active: 71 },
    ],
  },
  Reseller: {
    title: "GMV trend — Organic vs Reseller",
    primaryKey: "organic",
    secondaryKey: "reseller",
    primaryLabel: "Organic GMV",
    secondaryLabel: "Reseller GMV",
    primaryLight: "#9db8f5",
    primaryDark: "#2D4CC8",
    secondaryLight: "#9ee8b8",
    secondaryDark: "#25a36f",
    data: [
      { month: "Jan", organic: 60, reseller: 46 },
      { month: "Feb", organic: 57, reseller: 50 },
      { month: "Mar", organic: 63, reseller: 52 },
      { month: "Apr", organic: 66, reseller: 55 },
      { month: "May", organic: 70, reseller: 58 },
      { month: "Jun", organic: 74, reseller: 62 },
      { month: "Jul", organic: 82, reseller: 68 },
    ],
  },
  "Payment Gateway": {
    title: "GMV trend — Volume vs Settlements",
    primaryKey: "volume",
    secondaryKey: "settlements",
    primaryLabel: "Transaction Volume",
    secondaryLabel: "Settlement Volume",
    primaryLight: "#9db8f5",
    primaryDark: "#2D4CC8",
    secondaryLight: "#8de8ef",
    secondaryDark: "#40C3CF",
    data: [
      { month: "Jan", volume: 55, settlements: 48 },
      { month: "Feb", volume: 59, settlements: 51 },
      { month: "Mar", volume: 62, settlements: 54 },
      { month: "Apr", volume: 67, settlements: 58 },
      { month: "May", volume: 71, settlements: 61 },
      { month: "Jun", volume: 76, settlements: 65 },
      { month: "Jul", volume: 84, settlements: 73 },
    ],
  },
};

function formatGmv(value) {
  return `₹${value}L`;
}

export function OverviewBarChart() {
  const [activeTab, setActiveTab] = useState("Reseller");
  const config = chartConfig[activeTab];

  const chartData = useMemo(() => config.data, [config]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-[#13203F] sm:text-xl">{config.title}</h3>

        <div className="inline-flex w-fit flex-wrap rounded-full border border-slate-200 bg-white p-1">
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] text-white shadow-sm"
                    : "text-[#13203F]/70 hover:bg-slate-50 hover:text-[#13203F]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-72 w-full min-w-0 sm:h-80">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barGap={6} barCategoryGap="24%">
            <CartesianGrid stroke="#eef2f7" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(45, 76, 200, 0.06)" }}
              formatter={(value, name) => [formatGmv(value), name]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(19, 32, 63, 0.08)",
              }}
            />
            <Bar
              dataKey={config.primaryKey}
              name={config.primaryLabel}
              radius={[8, 8, 0, 0]}
              maxBarSize={34}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.month}-primary`}
                  fill={index === chartData.length - 1 ? config.primaryDark : config.primaryLight}
                />
              ))}
            </Bar>
            <Bar
              dataKey={config.secondaryKey}
              name={config.secondaryLabel}
              radius={[8, 8, 0, 0]}
              maxBarSize={34}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`${entry.month}-secondary`}
                  fill={index === chartData.length - 1 ? config.secondaryDark : config.secondaryLight}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-sm text-[#13203F]">
          <span className="size-2.5 rounded-full bg-[#2D4CC8]" aria-hidden />
          {config.primaryLabel}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#13203F]">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: config.secondaryDark }}
            aria-hidden
          />
          {config.secondaryLabel}
        </div>
      </div>
    </section>
  );
}
