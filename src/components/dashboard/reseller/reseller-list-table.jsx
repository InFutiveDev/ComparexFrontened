"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiClipboardDocumentList,
  HiDocumentText,
  HiEnvelope,
  HiOutlineMagnifyingGlass,
  HiPhone,
  HiUserCircle,
} from "react-icons/hi2";
import { ResellerNotesModal } from "@/components/dashboard/reseller/reseller-action-modals";
import { AccountStatusCell } from "@/components/dashboard/shared/account-status-cell";
import { RowActionsMenu } from "@/components/dashboard/shared/row-actions-menu";

const perPageOptions = [10, 20, 50];

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-600",
  "In review": "bg-amber-100 text-amber-700",
  Blocked: "bg-red-100 text-red-700",
};

function StatusBadge({ status }) {
  const label = status || "Inactive";
  const className = statusStyles[label] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide ${className}`}>
      {label.toUpperCase()}
    </span>
  );
}

function buildResellerRowActions(row, { onNotes }) {
  const profileHref = `/dashboard/resellers/${encodeURIComponent(row.id)}`;
  const leadsHref = `/dashboard/resellers/${encodeURIComponent(row.id)}/leads`;
  const followUpSubject = encodeURIComponent("Follow up from CompareX");
  const followUpBody = encodeURIComponent(
    `Hi ${row.name || "there"},\n\nWe wanted to follow up regarding your reseller partnership with CompareX.\n\nBest regards,\nCompareX Team`,
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
    row.email
      ? {
          type: "link",
          label: "Send Follow Up",
          icon: HiEnvelope,
          href: `mailto:${row.email}?subject=${followUpSubject}&body=${followUpBody}`,
          className: actionItemClass,
          iconClassName: "text-[#40C3CF]",
        }
      : {
          type: "button",
          label: "Send Follow Up",
          icon: HiEnvelope,
          disabled: true,
          className: actionItemClass,
          iconClassName: "text-[#40C3CF]",
        },
    {
      type: "link",
      label: "View Leads",
      icon: HiClipboardDocumentList,
      href: leadsHref,
      className: actionItemClass,
      iconClassName: "text-[#25a36f]",
    },
    {
      type: "button",
      label: "Notes",
      icon: HiDocumentText,
      onClick: () => onNotes?.(row),
      className: actionItemClass,
      iconClassName: "text-violet-600",
    },
  ];
}

export function ResellerListTable({
  rows = [],
  isLoading = false,
  onAccountStatusUpdated,
  onNotesSaved,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [notesRow, setNotesRow] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [
        row.name,
        row.company,
        row.email,
        row.phone,
        row.resellerType,
        row.status,
        String(row.totalLead ?? ""),
        String(row.qualifiedLead ?? ""),
        String(row.activatedLead ?? ""),
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
    <>
      {actionMessage ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {actionMessage}
        </div>
      ) : null}
      {actionError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#13203F]">Reseller Summary</h3>
            <p className="mt-1 text-sm text-slate-500">
              {isLoading
                ? "Loading resellers…"
                : `${filteredRows.length} reseller${filteredRows.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <HiOutlineMagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search resellers"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20"
            />
          </div>
        </div>

        {!isLoading && filteredRows.length === 0 ? (
          <div className="px-4 py-14 text-center sm:px-5">
            <p className="text-sm font-semibold text-[#13203F]">No resellers found</p>
            <p className="mt-1 text-sm text-slate-500">Try a different search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1280px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-[#0a27c9] text-[11px] font-semibold uppercase tracking-wide text-white">
                  <th className="px-4 py-3 sm:px-5">Reseller Name + Email ID</th>
                  <th className="px-3 py-3">Phone No</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Total Lead</th>
                  <th className="px-3 py-3">Qualified</th>
                  <th className="px-3 py-3">Activated</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Login Access</th>
                  <th className="px-4 py-3 text-right sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row) => {
                  const profileHref = `/dashboard/resellers/${encodeURIComponent(row.id)}`;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-[#EEF2FC]/35"
                    >
                      <td className="px-4 py-3.5 sm:px-5">
                        <Link href={profileHref} className="group block">
                          <p className="font-semibold text-[#13203F] group-hover:text-[#2D4CC8]">
                            {row.name || row.company || "—"}
                          </p>
                        </Link>
                        {row.email ? (
                          <a
                            href={`mailto:${row.email}`}
                            className="mt-0.5 inline-flex max-w-[240px] items-center gap-1 text-xs text-slate-500 transition hover:text-[#40C3CF]"
                          >
                            <HiEnvelope className="size-3.5 shrink-0 text-[#40C3CF]" aria-hidden />
                            <span className="truncate">{row.email}</span>
                          </a>
                        ) : (
                          <p className="mt-0.5 text-xs text-slate-500">—</p>
                        )}
                      </td>
                      <td className="px-3 py-3.5">
                        {row.phone ? (
                          <a
                            href={`tel:${row.phone}`}
                            className="inline-flex items-center gap-1.5 text-slate-700 transition hover:text-[#2D4CC8]"
                          >
                            <HiPhone className="size-4 shrink-0 text-[#2D4CC8]" aria-hidden />
                            {row.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 font-medium text-[#13203F]">
                        {row.resellerType || "—"}
                      </td>
                      <td className="px-3 py-3.5 font-medium text-[#13203F]" title="Total leads referred">
                        {row.totalLead ?? 0}
                      </td>
                      <td
                        className="px-3 py-3.5 font-medium text-[#13203F]"
                        title="Leads that passed CompareX qualification"
                      >
                        {row.qualifiedLead ?? 0}
                      </td>
                      <td
                        className="px-3 py-3.5 font-medium text-[#13203F]"
                        title="Referred leads marked live / activated"
                      >
                        {row.activatedLead ?? 0}
                      </td>
                      <td className="px-3 py-3.5">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-3 py-3.5">
                        <AccountStatusCell
                          row={row}
                          resource="reseller"
                          onUpdated={onAccountStatusUpdated}
                        />
                      </td>
                      <td className="relative overflow-visible px-4 py-3.5 text-right sm:px-5">
                        <RowActionsMenu
                          row={row}
                          isOpen={openActionMenuId === row.id}
                          onToggle={() =>
                            setOpenActionMenuId((current) => (current === row.id ? null : row.id))
                          }
                          onClose={() => setOpenActionMenuId(null)}
                          menuItems={buildResellerRowActions(row, {
                            onNotes: setNotesRow,
                          })}
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
              Showing {showingFrom}–{showingTo} of {filteredRows.length} resellers
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={perPage}
                onChange={(event) => {
                  setPerPage(Number(event.target.value));
                  setPage(1);
                }}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-[#13203F] outline-none"
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
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <HiChevronLeft className="size-4" aria-hidden />
                Prev
              </button>
              <span className="px-2 text-sm font-semibold text-[#13203F]">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <HiChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <ResellerNotesModal
        row={notesRow}
        onClose={() => setNotesRow(null)}
        onSaved={(message) => {
          setActionMessage(message);
          setActionError("");
          onNotesSaved?.(message);
        }}
      />
    </>
  );
}
