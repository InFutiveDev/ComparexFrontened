"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HiChevronDown, HiFunnel, HiOutlineXMark } from "react-icons/hi2";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchPgLeadFunnel } from "@/lib/dashboard-api";

const leadTypeOptions = [
  { value: "normal", label: "Normal lead" },
  { value: "tte", label: "TTE Lead" },
];

const barColors = {
  shared: "#2D4CC8",
  onboarding: "#40C3CF",
  accepted: "#25a36f",
};

export function PgLeadFunnelChart({ pgOptions = [], isLoadingOptions = false }) {
  const [selectedPgId, setSelectedPgId] = useState("");
  const [leadType, setLeadType] = useState("normal");
  const [filterOpen, setFilterOpen] = useState(false);
  const [series, setSeries] = useState([]);
  const [pgName, setPgName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const filterRef = useRef(null);

  useEffect(() => {
    if (!selectedPgId && pgOptions.length > 0) {
      setSelectedPgId(pgOptions[0].id);
    }
  }, [pgOptions, selectedPgId]);

  useEffect(() => {
    if (!selectedPgId) return;

    let cancelled = false;

    async function loadFunnel() {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchPgLeadFunnel({ pgId: selectedPgId, leadType });
        if (cancelled) return;
        setSeries(data.series ?? []);
        setPgName(data.pgName ?? "");
      } catch {
        if (!cancelled) {
          setSeries([]);
          setError("Unable to load lead funnel. Deploy the latest API or use local backend.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadFunnel();

    return () => {
      cancelled = true;
    };
  }, [selectedPgId, leadType]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!filterRef.current?.contains(event.target)) {
        setFilterOpen(false);
      }
    }

    if (filterOpen) {
      document.addEventListener("mousedown", handlePointerDown);
    }

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [filterOpen]);

  const selectedPgLabel = useMemo(() => {
    return pgOptions.find((item) => item.id === selectedPgId)?.name || pgName || "Select PG";
  }, [pgOptions, selectedPgId, pgName]);

  return (
    <article className="flex h-full min-h-[420px] flex-col rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#13203F]">Lead funnel</h3>
            <p className="mt-1 text-sm text-slate-500">
              Leads shared vs onboarding vs accepted —{" "}
              <span className="font-medium text-[#13203F]">{selectedPgLabel}</span>
            </p>
          </div>

          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-[#13203F] transition hover:border-[#2D4CC8]/30 hover:bg-slate-50"
              aria-expanded={filterOpen}
              aria-haspopup="listbox"
            >
              <HiFunnel className="size-4 text-[#2D4CC8]" aria-hidden />
              PG filter
              <HiChevronDown className="size-4 text-slate-400" aria-hidden />
            </button>

            {filterOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-72 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg shadow-[#13203F]/10">
                <div className="mb-2 flex items-center justify-between px-2 py-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    All payment gateways
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(false)}
                    className="cursor-pointer rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-[#13203F]"
                    aria-label="Close PG filter"
                  >
                    <HiOutlineXMark className="size-4" />
                  </button>
                </div>
                {isLoadingOptions ? (
                  <p className="px-2 py-3 text-sm text-slate-500">Loading PGs…</p>
                ) : pgOptions.length === 0 ? (
                  <p className="px-2 py-3 text-sm text-slate-500">No payment gateways found.</p>
                ) : (
                  pgOptions.map((pg) => {
                    const active = pg.id === selectedPgId;
                    return (
                      <button
                        key={pg.id}
                        type="button"
                        onClick={() => {
                          setSelectedPgId(pg.id);
                          setFilterOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                          active
                            ? "bg-[#EEF2FC] font-semibold text-[#2D4CC8]"
                            : "text-[#13203F] hover:bg-slate-50"
                        }`}
                      >
                        <span className="truncate">{pg.name}</span>
                        {active ? <span className="text-xs">Selected</span> : null}
                      </button>
                    );
                  })
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white p-1">
          {leadTypeOptions.map((option) => {
            const active = leadType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setLeadType(option.value)}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] text-white shadow-sm"
                    : "text-[#13203F]/70 hover:bg-slate-50 hover:text-[#13203F]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {error ? (
          <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-600">
            {error}
          </div>
        ) : (
          <div className="h-72 w-full min-w-0 sm:h-80">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={series} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={4}>
                  <CartesianGrid stroke="#eef2f7" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(45, 76, 200, 0.06)" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 8px 24px rgba(19, 32, 63, 0.08)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) =>
                      value === "shared"
                        ? "Leads shared"
                        : value === "onboarding"
                          ? "Onboarding"
                          : "Accepted"
                    }
                  />
                  <Bar
                    dataKey="shared"
                    name="shared"
                    fill={barColors.shared}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={22}
                  />
                  <Bar
                    dataKey="onboarding"
                    name="onboarding"
                    fill={barColors.onboarding}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={22}
                  />
                  <Bar
                    dataKey="accepted"
                    name="accepted"
                    fill={barColors.accepted}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
