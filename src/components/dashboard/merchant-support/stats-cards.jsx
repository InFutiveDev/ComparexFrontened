"use client";

import { useState } from "react";
import { HiArrowPath, HiArrowUp } from "react-icons/hi2";

const timeRanges = ["Today", "Week", "Month", "3 Months"];

export function StatsCards({ stats, onRefresh, isRefreshing }) {
  const [activeRange, setActiveRange] = useState("Month");

  return (
    <section className="space-y-5 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-[#13203F]">Merchant Support</h2>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#2D4CC8] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HiArrowPath className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden />
            Refresh
          </button>
        </div>

        <div className="inline-flex w-fit rounded-full bg-[#EEF2FC] p-1">
          {timeRanges.map((range) => {
            const active = activeRange === range;
            return (
              <button
                key={range}
                type="button"
                onClick={() => setActiveRange(range)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] text-white shadow-sm"
                    : "text-[#13203F]/70 hover:text-[#13203F]"
                }`}
              >
                {range}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className={`rounded-2xl border border-white/80 bg-gradient-to-br p-5 shadow-sm shadow-[#13203F]/5 ${stat.cardClass}`}
          >
            <p className="text-sm font-medium text-[#13203F]/70">{stat.label}</p>

            <div className="mt-3 flex items-start justify-between gap-3">
              <p className="text-3xl font-bold tracking-tight text-[#13203F]">{stat.value}</p>
              {stat.trend ? (
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-lg bg-[#25a36f]/15 px-2 py-1 text-xs font-semibold text-[#25a36f]">
                  {stat.trend}
                  <HiArrowUp className="size-3.5" aria-hidden />
                </span>
              ) : null}
            </div>

            {stat.previousLabel ? (
              <p className="mt-3 text-xs text-slate-500">
                {stat.previousLabel}{" "}
                <span className="font-medium text-slate-600">{stat.previousValue}</span>
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function buildStats(submissions) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCount = submissions.filter((item) => {
    const submitted = new Date(item.submittedAt);
    submitted.setHours(0, 0, 0, 0);
    return submitted.getTime() === today.getTime();
  }).length;

  const newCount = submissions.filter((item) => item.status === "New").length;
  const qualifiedCount = submissions.filter((item) => item.status === "Qualified").length;

  return [
    {
      label: "Total Form Submissions",
      value: String(submissions.length),
      trend: todayCount > 0 ? `+${todayCount} today` : null,
      previousLabel: "Source",
      previousValue: "Home page form",
      cardClass: "from-[#EEF2FC] to-[#f5f8ff]",
    },
    {
      label: "New Requests",
      value: String(newCount),
      trend: null,
      previousLabel: "Awaiting review",
      previousValue: "Support queue",
      cardClass: "from-[#ecfdf9] to-[#f2fcfa]",
    },
    {
      label: "Qualified Leads",
      value: String(qualifiedCount),
      trend: null,
      previousLabel: "In follow-up",
      previousValue: "PG recommendations",
      cardClass: "from-[#ecfdf5] to-[#f3fdf8]",
    },
    {
      label: "Submissions Today",
      value: String(todayCount),
      trend: null,
      previousLabel: "Live from website",
      previousValue: "Hero advice form",
      cardClass: "from-[#eef0f8] to-[#f6f7fc]",
    },
  ];
}

export { buildStats };
