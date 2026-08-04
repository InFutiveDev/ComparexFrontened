"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HiChevronDown } from "react-icons/hi2";
import { fetchMerchants, fetchPaymentGateways } from "@/lib/dashboard-api";
import {
  buildLeadsDailyTrend,
  buildTopPgVendors,
  mapMerchantListResponse,
  mapPaymentGatewayListResponse,
  resolvePgBrandLogo,
} from "@/lib/dashboard-mappers";

const SERIES = [
  { key: "total", label: "Total Leads Generated", color: "#2D4CC8" },
  { key: "qualified", label: "Qualified Leads", color: "#25a36f" },
  { key: "rejected", label: "Rejected Leads", color: "#ef4444" },
  { key: "onboarded", label: "Onboarded Leads", color: "#eab308" },
];

const TREND_DAYS = 11;
const TOP_VENDOR_COUNT = 5;

async function fetchAllPages(fetcher, mapper) {
  const pageSize = 100;
  let page = 1;
  const allRows = [];
  const seenIds = new Set();
  let totalCount = 0;

  while (page <= 100) {
    const response = await fetcher({ page, limit: pageSize });
    const items = mapper(response);
    totalCount = items.total ?? totalCount;

    for (const row of items.rows) {
      if (!row?.id || seenIds.has(row.id)) continue;
      seenIds.add(row.id);
      allRows.push(row);
    }

    if (items.rows.length === 0 || allRows.length >= totalCount || items.rows.length < pageSize) {
      break;
    }
    page += 1;
  }

  return allRows;
}

function VendorLogo({ name, logoUrl }) {
  const [failed, setFailed] = useState(false);
  const initials = String(name || "PG")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (!logoUrl || failed) {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF2FC] text-xs font-bold text-[#2D4CC8]">
        {initials || "PG"}
      </span>
    );
  }

  return (
    <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-100">
      <Image
        src={logoUrl}
        alt={`${name} logo`}
        width={36}
        height={36}
        className="object-contain p-1"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export function LeadsTrendSection() {
  const [merchantRows, setMerchantRows] = useState([]);
  const [pgRows, setPgRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPgId, setSelectedPgId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const [merchants, gateways] = await Promise.all([
          fetchAllPages(fetchMerchants, mapMerchantListResponse),
          fetchAllPages(fetchPaymentGateways, mapPaymentGatewayListResponse),
        ]);
        if (cancelled) return;
        setMerchantRows(merchants);
        setPgRows(gateways);
      } catch {
        if (!cancelled) {
          setError("Unable to load leads trend.");
          setMerchantRows([]);
          setPgRows([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handlePointerDown);
    }
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [dropdownOpen]);

  const allVendors = useMemo(
    () =>
      [...pgRows]
        .sort((a, b) => (b.totalLeadCount ?? 0) - (a.totalLeadCount ?? 0))
        .map((row) => {
          const name = row.name || row.company || "Payment Gateway";
          return {
            id: row.id,
            name,
            logoUrl: resolvePgBrandLogo(name),
            totalLeadCount: row.totalLeadCount ?? 0,
          };
        }),
    [pgRows],
  );

  const topVendors = useMemo(
    () => buildTopPgVendors(pgRows, TOP_VENDOR_COUNT),
    [pgRows],
  );

  const selectedPg = useMemo(
    () => allVendors.find((item) => item.id === selectedPgId) || null,
    [allVendors, selectedPgId],
  );

  const chartData = useMemo(
    () =>
      buildLeadsDailyTrend(merchantRows, {
        days: TREND_DAYS,
        pgFilter: selectedPg,
      }),
    [merchantRows, selectedPg],
  );

  const subtitle = selectedPg
    ? `Daily trend for ${selectedPg.name}`
    : "Daily trend of leads across all PG vendors";

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#13203F] sm:text-xl">Leads Trend Over Time</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {SERIES.map((item) => (
            <div key={item.key} className="flex items-center gap-2 text-sm text-[#13203F]">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div className="h-72 w-full min-w-0 sm:h-80">
        {isLoading ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
            Loading trend…
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-red-100 bg-red-50 px-4 text-center text-sm text-red-700">
            {error}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="#eef2f7" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 24px rgba(19, 32, 63, 0.08)",
                }}
              />
              <Legend content={() => null} />
              {SERIES.map((item) => (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={item.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 0, fill: item.color }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-base font-bold text-[#13203F]">
            Top PG Vendors{" "}
            <span className="font-medium text-slate-500">(Showing Top {TOP_VENDOR_COUNT})</span>
          </h4>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-[#13203F] transition hover:border-[#2D4CC8]/30 hover:bg-slate-50"
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
            >
              {selectedPg ? selectedPg.name : "View All Vendors"}
              <HiChevronDown
                className={`size-4 text-slate-500 transition ${dropdownOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>

            {dropdownOpen ? (
              <div
                role="listbox"
                className="absolute right-0 z-20 mt-2 max-h-64 w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-[#13203F]/10"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={!selectedPgId}
                  onClick={() => {
                    setSelectedPgId("");
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 ${
                    !selectedPgId ? "font-semibold text-[#2D4CC8]" : "text-[#13203F]"
                  }`}
                >
                  All PG vendors
                </button>
                {allVendors.map((vendor) => (
                  <button
                    key={vendor.id}
                    type="button"
                    role="option"
                    aria-selected={selectedPgId === vendor.id}
                    onClick={() => {
                      setSelectedPgId(vendor.id);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 ${
                      selectedPgId === vendor.id
                        ? "font-semibold text-[#2D4CC8]"
                        : "text-[#13203F]"
                    }`}
                  >
                    <VendorLogo name={vendor.name} logoUrl={vendor.logoUrl} />
                    <span className="min-w-0 flex-1 truncate">{vendor.name}</span>
                  </button>
                ))}
                {allVendors.length === 0 ? (
                  <p className="px-3 py-3 text-sm text-slate-500">No vendors available</p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: TOP_VENDOR_COUNT }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : topVendors.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
            No payment gateway vendors yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {topVendors.map((vendor) => {
              const active = selectedPgId === vendor.id;
              return (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() => setSelectedPgId(active ? "" : vendor.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                    active
                      ? "border-[#2D4CC8] bg-[#EEF2FC] shadow-sm"
                      : "border-slate-200 bg-white hover:border-[#2D4CC8]/25 hover:bg-slate-50"
                  }`}
                >
                  <VendorLogo name={vendor.name} logoUrl={vendor.logoUrl} />
                  <span className="min-w-0 truncate text-sm font-semibold text-[#13203F]">
                    {vendor.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
