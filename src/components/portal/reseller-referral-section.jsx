"use client";

import { useCallback, useEffect, useState } from "react";
import { HiArrowPath, HiClipboardDocument } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { fetchMyResellerLeads } from "@/lib/reseller";
import { LeadStatusBadge } from "@/components/sub-admin/leads-table";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

function FormStepBadge({ step }) {
  const complete = Number(step) >= 3;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        complete
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-amber-50 text-amber-700 ring-amber-200"
      }`}
    >
      {complete ? "Completed" : `Step ${step || 1} of 3`}
    </span>
  );
}

export function ResellerReferralSection() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    qualified: 0,
    assigned: 0,
    referral: 0,
    completed: 0,
  });
  const [statuses, setStatuses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [referralLink, setReferralLink] = useState("");
  const [resellerName, setResellerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyResellerLeads({
        page,
        limit: 25,
        status: filters.status || undefined,
        search: filters.search || undefined,
      });
      setLeads(data.leads || []);
      setTotal(data.total || 0);
      setStats(data.stats || stats);
      setStatuses(data.statuses || []);
      setReferralLink(data.referralLink || "");
      setResellerName(data.reseller?.businessName || data.reseller?.fullName || "");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load referral leads");
    } finally {
      setIsLoading(false);
    }
    // stats is only a fallback initial shape.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  useEffect(() => {
    const timer = window.setTimeout(loadLeads, filters.search ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [loadLeads, filters.search]);

  async function copyReferralLink() {
    await navigator.clipboard.writeText(referralLink);
    setMessage("Referral link copied");
  }

  const pages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Lead Referral Link Generator
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          FR-RS-01 · Share your unique referral link. FR-RS-02 · Merchants who register or submit
          leads through it are tracked here automatically.
        </p>
      </div>

      {(error || message) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Your referral link{resellerName ? ` · ${resellerName}` : ""}
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input className={inputClass} value={referralLink} readOnly />
          <button
            type="button"
            disabled={!referralLink}
            onClick={copyReferralLink}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2D4CC8] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            <HiClipboardDocument className="size-4" />
            Copy link
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Share this link with merchants. Registrations completed through it appear in your referral
          leads list below.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {[
          ["Total", stats.total],
          ["New", stats.new],
          ["Qualified", stats.qualified],
          ["Assigned", stats.assigned],
          ["Referral", stats.referral],
          ["Completed", stats.completed],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-[#13203F]">{value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className={inputClass}
            placeholder="Search business, email, or phone"
            value={filters.search}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, search: e.target.value }));
            }}
          />
          <select
            className={inputClass}
            value={filters.status}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({ ...prev, status: e.target.value }));
            }}
          >
            <option value="">All lead statuses</option>
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={loadLeads}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            <HiArrowPath className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">Merchant</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Lead status</th>
                <th className="px-3 py-3">Form progress</th>
                <th className="px-3 py-3">Registered</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-slate-500">
                    No referral leads yet. Share your link to start tracking merchants.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-100">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-[#13203F]">{lead.businessName}</p>
                      <p className="text-xs text-slate-500">{lead.industry || "Industry not set"}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      <p>{lead.email}</p>
                      <p className="text-xs">{lead.phone}</p>
                    </td>
                    <td className="px-3 py-3">
                      <LeadStatusBadge status={lead.leadStatus} />
                    </td>
                    <td className="px-3 py-3">
                      <FormStepBadge step={lead.formStep} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                      {lead.createdAt
                        ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                            new Date(lead.createdAt),
                          )
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {page} of {pages} · {total} result{total === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((value) => Math.min(pages, value + 1))}
              className="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
