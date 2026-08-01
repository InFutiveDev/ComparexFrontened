"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { RowActionsMenu } from "@/components/dashboard/shared/row-actions-menu";

const perPageOptions = [10, 20, 50];

const DEMO_STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No show" },
  { value: "rescheduled", label: "Rescheduled" },
];

const ONBOARDING_OPTIONS = [
  { value: "", label: "All" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "in_progress", label: "Inprogress" },
  { value: "rejected", label: "Rejected" },
];

const demoStatusStyles = {
  Scheduled: "bg-sky-100 text-sky-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-700",
  "No show": "bg-orange-100 text-orange-800",
  Rescheduled: "bg-violet-100 text-violet-800",
};

const onboardingStyles = {
  Yes: "bg-emerald-100 text-emerald-800",
  No: "bg-slate-100 text-slate-600",
  Inprogress: "bg-amber-100 text-amber-800",
  Rejected: "bg-red-100 text-red-700",
};

function Badge({ value, stylesMap }) {
  const className = stylesMap[value] ?? "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide ${className}`}
    >
      {value}
    </span>
  );
}

export function TalkToExpertListTable({
  rows = [],
  isLoading = false,
  getRowActionItems,
  detailsBasePath = "/dashboard/talk-to-expert",
}) {
  const [search, setSearch] = useState("");
  const [demoFilter, setDemoFilter] = useState("");
  const [onboardingFilter, setOnboardingFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (demoFilter && row.demoStatus !== demoFilter) return false;
      if (onboardingFilter && row.onboardingStatus !== onboardingFilter) return false;
      if (!query) return true;
      return [
        row.bookingId,
        row.merchantName,
        row.expertName,
        row.pgName,
        row.demoDateTime,
        row.demoStatusLabel,
        row.onboardingStatusLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [rows, search, demoFilter, onboardingFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / perPage));
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRows.slice(start, start + perPage);
  }, [filteredRows, page, perPage]);

  const showingFrom = filteredRows.length === 0 ? 0 : (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, filteredRows.length);

  const selectClass =
    "rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-lg font-bold text-[#13203F]">Expert bookings</h3>
          <label className="relative min-w-[240px] sm:max-w-sm lg:ml-auto">
            <span className="sr-only">Search bookings</span>
            <HiOutlineMagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search booking, merchant, expert, PG…"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
            <select
              className={selectClass}
              value={demoFilter}
              onChange={(e) => {
                setDemoFilter(e.target.value);
                setPage(1);
              }}
            >
              {DEMO_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Onboarding
            <select
              className={selectClass}
              value={onboardingFilter}
              onChange={(e) => {
                setOnboardingFilter(e.target.value);
                setPage(1);
              }}
            >
              {ONBOARDING_OPTIONS.map((opt) => (
                <option key={opt.value || "all-onb"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filteredRows.length === 0 && !isLoading ? (
        <div className="px-4 py-14 text-center sm:px-5">
          <p className="text-sm font-semibold text-[#13203F]">No expert bookings found</p>
          <p className="mt-1 text-sm text-slate-500">
            Talk to Expert form submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-[#0a27c9] text-[11px] font-semibold uppercase tracking-wide text-white">
                <th className="px-4 py-3 sm:px-5">Booking ID</th>
                <th className="px-3 py-3">Merchant name</th>
                <th className="px-3 py-3">Expert</th>
                <th className="px-3 py-3">PG</th>
                <th className="px-3 py-3">Date &amp; time (Demo)</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Onboarding</th>
                <th className="px-4 py-3 text-right sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => {
                const detailsHref = `${detailsBasePath}/${encodeURIComponent(row.id)}`;
                const menuItems = getRowActionItems?.(row, { detailsHref }) ?? [];

                return (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 transition last:border-b-0 hover:bg-[#EEF2FC]/35"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-[#2D4CC8] sm:px-5">
                      {row.bookingId}
                    </td>
                    <td className="px-3 py-3.5">
                      <Link
                        href={detailsHref}
                        className="font-semibold text-[#13203F] hover:text-[#2D4CC8]"
                      >
                        {row.merchantName}
                      </Link>
                      <p className="mt-0.5 text-xs text-slate-500">{row.name}</p>
                    </td>
                    <td className="px-3 py-3.5 text-slate-700">{row.expertName}</td>
                    <td className="px-3 py-3.5 text-slate-700">{row.pgName}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-slate-700">
                      {row.demoDateTime}
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge value={row.demoStatusLabel} stylesMap={demoStatusStyles} />
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge value={row.onboardingStatusLabel} stylesMap={onboardingStyles} />
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-5">
                      <RowActionsMenu
                        row={row}
                        isOpen={openActionMenuId === row.id}
                        onToggle={() =>
                          setOpenActionMenuId((current) => (current === row.id ? null : row.id))
                        }
                        onClose={() => setOpenActionMenuId(null)}
                        menuItems={menuItems}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredRows.length > 0 ? (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-slate-500">
            Showing {showingFrom}–{showingTo} of {filteredRows.length}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              Rows
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
              >
                {perPageOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
                aria-label="Previous page"
              >
                <HiChevronLeft className="size-4" />
              </button>
              <span className="min-w-[4rem] text-center text-xs text-slate-600">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
                aria-label="Next page"
              >
                <HiChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
