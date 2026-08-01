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

const listStatusStyles = {
  Open: "bg-sky-100 text-sky-800",
  InProgress: "bg-amber-100 text-amber-800",
  Resolved: "bg-emerald-100 text-emerald-800",
  NA: "bg-slate-100 text-slate-600",
};

const priorityStyles = {
  Low: "bg-slate-100 text-slate-700",
  Med: "bg-[#EEF2FC] text-[#2D4CC8]",
  High: "bg-red-100 text-red-700",
  NA: "bg-slate-100 text-slate-500",
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

export function MerchantSupportListTable({
  rows = [],
  isLoading = false,
  getRowActionItems,
  detailsBasePath = "/dashboard/merchant-support",
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [
        row.ticketId,
        row.name,
        row.issueCategory,
        row.listStatus,
        row.priority,
        row.assignee,
        row.pgLabel,
        row.responseTimeLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / perPage));
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRows.slice(start, start + perPage);
  }, [filteredRows, page, perPage]);

  const showingFrom = filteredRows.length === 0 ? 0 : (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, filteredRows.length);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-lg font-bold text-[#13203F]">Support tickets</h3>
        <label className="relative min-w-[240px] sm:max-w-sm">
          <span className="sr-only">Search support tickets</span>
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
            placeholder="Search ticket, business, PG, agent…"
            className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20"
          />
        </label>
      </div>

      {filteredRows.length === 0 && !isLoading ? (
        <div className="px-4 py-14 text-center sm:px-5">
          <p className="text-sm font-semibold text-[#13203F]">No support tickets found</p>
          <p className="mt-1 text-sm text-slate-500">
            Submissions from the merchant support desk will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-[#0a27c9] text-[11px] font-semibold uppercase tracking-wide text-white">
                <th className="px-4 py-3 sm:px-5">Ticket Id</th>
                <th className="px-3 py-3">Biz Name</th>
                <th className="px-3 py-3">Issue category</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3">Assigned to</th>
                <th className="px-3 py-3">PG</th>
                <th className="px-3 py-3">Response Time</th>
                <th className="px-4 py-3 text-right sm:px-5">Action</th>
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
                      {row.ticketId}
                    </td>
                    <td className="px-3 py-3.5">
                      <Link
                        href={detailsHref}
                        className="font-semibold text-[#13203F] hover:text-[#2D4CC8]"
                      >
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="max-w-[200px] text-slate-700 line-clamp-2">
                        {row.issueCategory}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge value={row.listStatus} stylesMap={listStatusStyles} />
                    </td>
                    <td className="px-3 py-3.5">
                      <Badge value={row.priority} stylesMap={priorityStyles} />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: row.assigneeColor }}
                          title={row.assignee}
                        >
                          {row.assigneeInitials}
                        </div>
                        <span className="max-w-[140px] truncate text-slate-700">{row.assignee}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-slate-700">{row.pgLabel}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-slate-700">
                      {row.responseTimeLabel}
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
