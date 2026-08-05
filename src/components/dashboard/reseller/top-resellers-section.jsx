"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HiTrophy } from "react-icons/hi2";
import { fetchResellerTopLeaders } from "@/lib/dashboard-api";
import {
  buildTopResellersFromRows,
  getResellerTopPeriodBounds,
  mapResellerTopLeadersResponse,
} from "@/lib/dashboard-mappers";

const PERIODS = [
  { key: "M", label: "Monthly", title: "Month" },
  { key: "Q", label: "Quarterly", title: "Quarter" },
  { key: "Y", label: "Yearly", title: "Year" },
];

const rankStyles = {
  1: "bg-amber-100 text-amber-700 ring-amber-200",
  2: "bg-slate-100 text-slate-700 ring-slate-200",
  3: "bg-orange-50 text-orange-700 ring-orange-200",
};

export function TopResellersSection({ rows = [], isLoadingRows = false }) {
  const [period, setPeriod] = useState("M");
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  const fallbackLeaders = useMemo(
    () => buildTopResellersFromRows(rows, 5),
    [rows],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const bounds = getResellerTopPeriodBounds(period);

      try {
        const data = await fetchResellerTopLeaders({
          from: bounds.start,
          to: bounds.end,
          limit: 5,
        });
        const mapped = mapResellerTopLeadersResponse(data);

        if (cancelled) return;

        if (mapped.length > 0) {
          setLeaders(mapped);
          setUsedFallback(false);
        } else {
          setLeaders(fallbackLeaders);
          setUsedFallback(true);
        }
      } catch {
        if (!cancelled) {
          setLeaders(fallbackLeaders);
          setUsedFallback(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [period, fallbackLeaders]);

  const showLoading = isLoading || (usedFallback && isLoadingRows);
  const maxMetric = useMemo(() => {
    if (leaders.length === 0) return 1;
    return Math.max(
      1,
      ...leaders.map((item) =>
        item.totalGmv != null ? Number(item.totalGmv) || 0 : Number(item.totalLeadCount) || 0,
      ),
    );
  }, [leaders]);

  const periodTitle = PERIODS.find((item) => item.key === period)?.title || "Month";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FC] text-[#2D4CC8]">
            <HiTrophy className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#13203F] sm:text-xl">Top Reseller</h3>
            <p className="mt-1 text-sm text-slate-500">
              {usedFallback
                ? `Top performers by total leads · ${periodTitle}`
                : `Ranked by GMV · ${periodTitle}`}
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white p-1">
          {PERIODS.map((item) => {
            const active = period === item.key;
            return (
              <button
                key={item.key}
                type="button"
                title={item.title}
                onClick={() => setPeriod(item.key)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] text-white shadow-sm"
                    : "text-[#13203F]/70 hover:bg-slate-50 hover:text-[#13203F]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {showLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : leaders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
          No reseller performance data for this period yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {leaders.map((leader) => {
            const metricValue =
              leader.totalGmv != null
                ? Number(leader.totalGmv) || 0
                : Number(leader.totalLeadCount) || 0;
            const widthPercent = Math.round((metricValue / maxMetric) * 100);
            const rankClass =
              rankStyles[leader.rank] ?? "bg-[#EEF2FC] text-[#2D4CC8] ring-[#2D4CC8]/15";

            return (
              <Link
                key={leader.id}
                href={`/dashboard/resellers/${encodeURIComponent(leader.id)}`}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-[#2D4CC8]/25 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 ${rankClass}`}
                  >
                    #{leader.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[#13203F]">{leader.name}</p>
                    <p className="truncate text-xs text-slate-500">{leader.company}</p>
                  </div>
                </div>

                <p className="mt-3 text-lg font-bold text-[#2D4CC8]">{leader.metricLabel}</p>
                <p className="text-xs text-slate-500">{leader.metricSubLabel}</p>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF]"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
