"use client";

import { useMemo, useState } from "react";
import { HiArrowDown, HiArrowUp } from "react-icons/hi2";
import { buildReviewStatsCardsForRange } from "@/lib/dashboard-mappers";

const timeRanges = ["Today", "Week", "Month", "3 Months"];

const trendStyles = {
  up: "bg-[#25a36f]/15 text-[#25a36f]",
  down: "bg-red-100 text-red-600",
  neutral: "bg-slate-100 text-slate-500",
};

export function StatsCards({ rows = [], isLoading = false }) {
  const [activeRange, setActiveRange] = useState("Month");

  const stats = useMemo(
    () => buildReviewStatsCardsForRange(rows, activeRange),
    [rows, activeRange],
  );

  return (
    <section className="space-y-5 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#13203F]">Reviews & Ratings</h2>
          <p className="mt-1 text-sm text-slate-600">
            Moderate reviews submitted from the website Write a Review form.
          </p>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <article
            key={stat.key || stat.label}
            className={`rounded-2xl border border-white/80 bg-gradient-to-br p-5 shadow-sm shadow-[#13203F]/5 ${stat.cardClass}`}
          >
            <p className="text-sm font-medium text-[#13203F]/70">{stat.label}</p>

            <div className="mt-3 flex items-start justify-between gap-3">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
              ) : (
                <p className="text-2xl font-bold leading-tight tracking-tight text-[#13203F] sm:text-3xl">
                  {stat.value}
                </p>
              )}

              {!isLoading && stat.trendDirection !== "neutral" ? (
                <span
                  className={`inline-flex shrink-0 items-center gap-0.5 rounded-lg px-2 py-1 text-xs font-semibold ${
                    trendStyles[stat.trendDirection] ?? trendStyles.neutral
                  }`}
                >
                  {stat.trend}
                  {stat.trendDirection === "up" ? (
                    <HiArrowUp className="size-3.5" aria-hidden />
                  ) : stat.trendDirection === "down" ? (
                    <HiArrowDown className="size-3.5" aria-hidden />
                  ) : null}
                </span>
              ) : null}
            </div>

            {!isLoading && stat.subtitle ? (
              <p className="mt-2 text-xs font-medium text-slate-600">{stat.subtitle}</p>
            ) : null}

            {!isLoading ? (
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
