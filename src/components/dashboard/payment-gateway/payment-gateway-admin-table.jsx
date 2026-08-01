"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiClipboardDocumentList,
  HiEnvelope,
  HiOutlineMagnifyingGlass,
  HiUserCircle,
} from "react-icons/hi2";
import { RowActionsMenu } from "@/components/dashboard/shared/row-actions-menu";

const perPageOptions = [10, 20, 50];

const pgStatusStyles = {
  Approved: "bg-emerald-100 text-emerald-700",
  "In Review": "bg-amber-100 text-amber-700",
  "Query Raised": "bg-red-100 text-red-700",
};

function PgStatusBadge({ status }) {
  const className = pgStatusStyles[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide ${className}`}>
      {status.toUpperCase()}
    </span>
  );
}

function buildPgAdminRowActions(row) {
  const profileHref = `/dashboard/payment-gateways/${encodeURIComponent(row.id)}`;
  const regularLeadsHref = `/dashboard/payment-gateways/${encodeURIComponent(row.id)}/leads?leadView=regular`;
  const tteLeadsHref = `/dashboard/payment-gateways/${encodeURIComponent(row.id)}/leads?leadView=tte`;
  const followUpSubject = encodeURIComponent("Follow up from CompareX");
  const followUpBody = encodeURIComponent(
    `Hi ${row.name || "there"},\n\nWe wanted to follow up regarding your payment gateway partnership with CompareX.\n\nBest regards,\nCompareX Team`,
  );
  const actionItemClass = "text-[#13203F] hover:bg-slate-50";

  return [
    {
      type: "link",
      label: "View Profile",
      icon: HiUserCircle,
      href: profileHref,
      className: actionItemClass,
      iconClassName: "text-[#2D4CC8]",
    },
    ...(row.email
      ? [
          {
            type: "link",
            label: "Send Follow Up",
            icon: HiEnvelope,
            href: `mailto:${row.email}?subject=${followUpSubject}&body=${followUpBody}`,
            className: actionItemClass,
            iconClassName: "text-[#40C3CF]",
          },
        ]
      : [
          {
            type: "button",
            label: "Send Follow Up",
            icon: HiEnvelope,
            disabled: true,
            className: actionItemClass,
            iconClassName: "text-[#40C3CF]",
          },
        ]),
    {
      type: "link",
      label: "View Lead (Regular)",
      icon: HiClipboardDocumentList,
      href: regularLeadsHref,
      className: actionItemClass,
      iconClassName: "text-[#25a36f]",
    },
    {
      type: "link",
      label: "View Lead (TTE)",
      icon: HiClipboardDocumentList,
      href: tteLeadsHref,
      className: actionItemClass,
      iconClassName: "text-violet-600",
    },
  ];
}

export function PaymentGatewayAdminTable({ rows = [], isLoading = false }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.name, row.email, row.phone, row.comparexRm, row.status]
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
        <h3 className="text-lg font-bold text-[#13203F]">Payment gateway partners</h3>
        <label className="relative min-w-[220px] sm:max-w-xs">
          <span className="sr-only">Search payment gateways</span>
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
            placeholder="Search PG name, email, RM…"
            className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20"
          />
        </label>
      </div>

      {filteredRows.length === 0 && !isLoading ? (
        <div className="px-4 py-14 text-center sm:px-5">
          <p className="text-sm font-semibold text-[#13203F]">No payment gateways found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1280px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-[#0a27c9] text-[11px] font-semibold uppercase tracking-wide text-white">
                <th className="px-4 py-3 sm:px-5">PG summary</th>
                <th className="px-3 py-3">Leads</th>
                <th className="px-3 py-3">Accepted</th>
                <th className="px-3 py-3">Conversion rate</th>
                <th className="px-3 py-3">TTE lead</th>
                <th className="px-3 py-3">TTE conversion</th>
                <th className="px-3 py-3">Pending leads</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-4 py-3 text-right sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => {
                const profileHref = `/dashboard/payment-gateways/${encodeURIComponent(row.id)}`;
                return (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 transition last:border-b-0 hover:bg-[#EEF2FC]/35"
                  >
                    <td className="px-4 py-3.5 sm:px-5">
                      <Link href={profileHref} className="group block">
                        <p className="font-semibold text-[#13203F] group-hover:text-[#2D4CC8]">
                          {row.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          View profile — {row.email || "—"} · {row.phone || "—"} · RM:{" "}
                          {row.comparexRm || "—"}
                        </p>
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-[#13203F]">{row.totalLeadCount ?? 0}</td>
                    <td className="px-3 py-3.5 font-medium text-[#13203F]">{row.acceptedLeadCount ?? 0}</td>
                    <td className="px-3 py-3.5 font-medium text-[#13203F]">
                      {row.conversionRateLabel ?? "0%"}
                    </td>
                    <td className="px-3 py-3.5 font-medium text-[#13203F]">{row.tteLeadCount ?? 0}</td>
                    <td className="px-3 py-3.5 font-medium text-[#13203F]">
                      {row.tteConversionRateLabel ?? "0%"}
                    </td>
                    <td className="px-3 py-3.5 font-medium text-[#13203F]">{row.pendingLeadCount ?? 0}</td>
                    <td className="px-3 py-3.5">
                      <PgStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-5">
                      <RowActionsMenu
                        row={row}
                        isOpen={openActionMenuId === row.id}
                        onToggle={() =>
                          setOpenActionMenuId((current) => (current === row.id ? null : row.id))
                        }
                        onClose={() => setOpenActionMenuId(null)}
                        menuItems={buildPgAdminRowActions(row)}
                      />
                    </td>
                  </tr>
                );
              })}
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <tr key={`loading-${index}`} className="border-b border-slate-100">
                      <td colSpan={9} className="px-4 py-4">
                        <div className="h-8 animate-pulse rounded-lg bg-slate-100" />
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      )}

      {filteredRows.length > 0 ? (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm text-slate-500">
            Showing {showingFrom}–{showingTo} of {filteredRows.length} payment gateways
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={perPage}
              onChange={(event) => {
                setPerPage(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-[#13203F]"
            >
              {perPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option} / page
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              <HiChevronLeft className="size-4" aria-hidden />
              Prev
            </button>
            <span className="text-sm text-slate-600">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
              <HiChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
