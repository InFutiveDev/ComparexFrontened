"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import {
  LEAD_STATUS_OPTIONS,
  fetchSubAdminLeads,
  formatLeadStatus,
} from "@/lib/sub-admin";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

function statusStyle(status) {
  const styles = {
    new: "bg-blue-50 text-blue-700 ring-blue-200",
    in_review: "bg-amber-50 text-amber-700 ring-amber-200",
    qualified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",
    assigned: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    expert_booked: "bg-violet-50 text-violet-700 ring-violet-200",
  };
  return styles[status] || styles.new;
}

export function LeadStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyle(
        status
      )}`}
    >
      {formatLeadStatus(status)}
    </span>
  );
}

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export function LeadsTableSection({
  title = "Lead Qualification",
  description = "Review and qualify incoming merchant leads.",
  defaultStatus = "",
  showAssignCta = true,
}) {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: defaultStatus,
    industry: "",
    location: "",
    search: "",
  });

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchSubAdminLeads({
        page,
        limit: perPage,
        status: filters.status || undefined,
        industry: filters.industry || undefined,
        location: filters.location || undefined,
        search: filters.search || undefined,
      });
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load leads");
      setLeads([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, perPage]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        {showAssignCta ? (
          <Link
            href="/sub-admin-dashboard/assign"
            className="inline-flex rounded-full bg-[#2D4CC8] px-4 py-2 text-sm font-semibold text-white"
            style={{ color: "#fff" }}
          >
            Go to Assignment
          </Link>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </label>
            <select
              className={inputClass}
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              <option value="">All statuses</option>
              {LEAD_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Industry / Category
            </label>
            <input
              className={inputClass}
              placeholder="e.g. ecommerce-d2c"
              value={filters.industry}
              onChange={(e) => updateFilter("industry", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Location
            </label>
            <input
              className={inputClass}
              placeholder="City / region"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search
            </label>
            <input
              className={inputClass}
              placeholder="Business, email, phone"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={loadLeads}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#13203F]"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3 text-sm text-slate-500">
          {isLoading
            ? "Loading leads…"
            : total === 0
              ? "0 leads"
              : `Showing ${from}–${to} of ${total} lead${total === 1 ? "" : "s"}`}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Industry</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned PG</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    No leads found for the selected filters.
                  </td>
                </tr>
              ) : null}
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-100 hover:bg-[#EEF2FC]/35">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#13203F]">{lead.businessName}</p>
                    <p className="text-xs text-slate-500">{lead.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[#13203F]">{lead.email}</p>
                    <p className="text-xs text-slate-500">{lead.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{lead.industry || "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{lead.location || "—"}</td>
                  <td className="px-4 py-3">
                    <LeadStatusBadge status={lead.leadStatus} />
                  </td>
                  <td className="px-4 py-3 text-slate-700">{lead.assignedPgName || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/sub-admin-dashboard/leads/${lead.id}`}
                      className="font-semibold text-[#2D4CC8] hover:underline"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {total > 0 ? (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Show</span>
              <select
                value={perPage}
                onChange={(event) => {
                  setPerPage(Number(event.target.value));
                  setPage(1);
                }}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20"
              >
                {PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1 || isLoading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <HiChevronLeft className="size-4" aria-hidden />
                Prev
              </button>

              {getPageNumbers(page, totalPages).map((pageNumber, index, pages) => {
                const previous = pages[index - 1];
                const showEllipsis = previous && pageNumber - previous > 1;
                return (
                  <span key={pageNumber} className="inline-flex items-center gap-1">
                    {showEllipsis ? (
                      <span className="px-1 text-sm text-slate-400">…</span>
                    ) : null}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setPage(pageNumber)}
                      className={`min-w-8 cursor-pointer rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
                        pageNumber === page
                          ? "bg-[#25a36f]/15 text-[#25a36f]"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </span>
                );
              })}

              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <HiChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
