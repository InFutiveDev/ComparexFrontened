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
  Reseller: {
    title: "GMV trend",
    primaryKey: "referred",
    secondaryKey: "onboarded",
    primaryLabel: "Referred Lead",
    secondaryLabel: "Onboarded",
    primaryLight: "#9db8f5",
    primaryDark: "#2D4CC8",
    secondaryLight: "#8ee4cf",
    secondaryDark: "#25a36f",
    data: [
      { month: "Jan", referred: 48, onboarded: 38 },
      { month: "Feb", referred: 52, onboarded: 42 },
      { month: "Mar", referred: 55, onboarded: 46 },
      { month: "Apr", referred: 58, onboarded: 49 },
      { month: "May", referred: 62, onboarded: 53 },
      { month: "Jun", referred: 66, onboarded: 57 },
      { month: "Jul", referred: 72, onboarded: 64 },
    ],
  },
  "Payment Gateway": {
    title: "Revenue — MDR vs Per Lead",
    primaryKey: "mdr",
    secondaryKey: "perLead",
    primaryLabel: "MDR Revenue",
    secondaryLabel: "Per Lead Revenue",
    primaryLight: "#9db8f5",
    primaryDark: "#2D4CC8",
    secondaryLight: "#8de8ef",
    secondaryDark: "#40C3CF",
    data: [
      { month: "Jan", mdr: 42, perLead: 18 },
      { month: "Feb", mdr: 45, perLead: 19 },
      { month: "Mar", mdr: 48, perLead: 21 },
      { month: "Apr", mdr: 51, perLead: 22 },
      { month: "May", mdr: 54, perLead: 24 },
      { month: "Jun", mdr: 58, perLead: 26 },
      { month: "Jul", mdr: 63, perLead: 28 },
    ],
  },
};

function formatGmv(value) {
  return `₹${value}L`;
}

export function OverviewBarChart() {
  const [activeTab, setActiveTab] = useState("Merchant");
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
