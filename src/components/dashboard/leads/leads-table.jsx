"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useDashboard } from "@/components/dashboard/layout/dashboard-context";
import { leads } from "@/lib/mock-data";

function statusClass(status) {
  if (status === "Won") return "bg-emerald-100 text-emerald-700";
  if (status === "Proposal") return "bg-blue-100 text-blue-700";
  if (status === "Qualified") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function matchesLeadSearch(lead, query) {
  const haystack = [
    lead.id,
    lead.name,
    lead.company,
    lead.email,
    lead.status,
    lead.source,
    String(lead.score),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function LeadsTable() {
  const { leadSearch } = useDashboard();

  const filteredLeads = useMemo(() => {
    const query = leadSearch.trim().toLowerCase();
    if (!query) return leads;
    return leads.filter((lead) => matchesLeadSearch(lead, query));
  }, [leadSearch]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#13203F] sm:text-lg">Recent Leads</h2>
          {leadSearch.trim() ? (
            <p className="mt-0.5 text-xs text-slate-500">
              {filteredLeads.length} result{filteredLeads.length === 1 ? "" : "s"} for &quot;{leadSearch.trim()}&quot;
            </p>
          ) : null}
        </div>
        <Link
          href="/dashboard/leads"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-[#13203F] transition hover:border-[#2D4CC8]/40 hover:bg-slate-50"
        >
          View All
        </Link>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
          <p className="text-sm font-medium text-[#13203F]">No leads found</p>
          <p className="mt-1 text-sm text-slate-500">Try a different name, company, email, or status.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-2 py-3 font-medium">Lead</th>
                <th className="px-2 py-3 font-medium">Company</th>
                <th className="px-2 py-3 font-medium">Status</th>
                <th className="px-2 py-3 font-medium">Source</th>
                <th className="px-2 py-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-2 py-3">
                    <p className="font-medium text-slate-900">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.email}</p>
                  </td>
                  <td className="px-2 py-3 text-slate-700">{lead.company}</td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-slate-700">{lead.source}</td>
                  <td className="px-2 py-3 font-semibold text-slate-800">{lead.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
