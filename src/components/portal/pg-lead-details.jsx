"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { HiArrowLeft, HiClock, HiUserCircle } from "react-icons/hi2";
import { PgLeadStatusBadge } from "@/components/portal/pg-leads-section";
import { ApiError } from "@/lib/api";
import { fetchMyPgLeadById, updateMyPgLeadStatus } from "@/lib/payment";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";
const notificationsEnabled =
  process.env.NEXT_PUBLIC_NOTIFICATIONS_ENABLED === "true";

function displayDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Field({ label, children }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-1 break-words text-sm font-semibold text-[#13203F]">
        {children || "—"}
      </div>
    </div>
  );
}

export function PgLeadDetails({ params }) {
  const { id } = use(params);
  const [lead, setLead] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadLead = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyPgLeadById(id);
      setLead(data.lead);
      setTimeline(data.timeline || []);
      setStatus(
        ["live", "rejected"].includes(data.lead?.pgLeadStatus)
          ? data.lead.pgLeadStatus
          : "",
      );
      setRemarks(data.lead?.pgRemarks || "");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load lead");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  async function handleStatusUpdate(event) {
    event.preventDefault();
    if (!status) {
      setError("Select Live or Rejected");
      return;
    }
    if (!remarks.trim()) {
      setError("Remarks are mandatory for status updates");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const data = await updateMyPgLeadStatus(id, {
        status,
        remarks: remarks.trim(),
      });
      setLead(data.lead);
      setTimeline(data.timeline || []);
      setMessage(
        data.notificationsCreated
          ? `${data.message}. Sub Admin and merchant notifications were created.`
          : data.message,
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update lead status");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
        Loading lead…
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-4">
        <Link
          href="/payment-gateway-dashboard/leads"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2D4CC8]"
        >
          <HiArrowLeft className="size-4" /> Back to leads
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center text-sm text-red-700">
          {error || "Lead not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/payment-gateway-dashboard/leads"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#2D4CC8]"
      >
        <HiArrowLeft className="size-4" /> Back to leads
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#13203F]">{lead.businessName}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {lead.originLabel} · Created {displayDate(lead.createdAt)}
          </p>
        </div>
        <PgLeadStatusBadge status={lead.pgLeadStatus} />
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

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <HiUserCircle className="size-5 text-[#2D4CC8]" />
            <h3 className="font-bold text-[#13203F]">Merchant lead</h3>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Business">{lead.businessName}</Field>
            <Field label="Email">{lead.email}</Field>
            <Field label="Phone">{lead.phone}</Field>
            <Field label="Industry">{lead.industry}</Field>
            <Field label="Priority">{lead.priority}</Field>
            <Field label="Location">{lead.location}</Field>
            <Field label="Source">{lead.originLabel}</Field>
            <Field label="Assigned">{displayDate(lead.assignedAt)}</Field>
          </div>
        </section>

        <form
          onSubmit={handleStatusUpdate}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div>
            <h3 className="font-bold text-[#13203F]">
              Update lead status · FR-PG-04
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Select Live or Rejected. Remarks are mandatory.
              {notificationsEnabled
                ? " The update will be shared with the Sub Admin and merchant."
                : ""}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status *
            </label>
            <select
              required
              className={inputClass}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Choose status…</option>
              <option value="live">Live</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Mandatory remarks *
            </label>
            <textarea
              required
              rows={5}
              className={`${inputClass} resize-y`}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Explain activation details or the rejection reason."
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {isSaving
              ? "Updating…"
              : notificationsEnabled
                ? "Update status & notify"
                : "Update status"}
          </button>

          {lead.pgStatusUpdatedAt ? (
            <p className="text-xs text-slate-500">
              Last updated {displayDate(lead.pgStatusUpdatedAt)}
            </p>
          ) : null}
        </form>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <HiClock className="size-5 text-[#2D4CC8]" />
          <h3 className="font-bold text-[#13203F]">Lead activity</h3>
        </div>
        {timeline.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No activity recorded yet.</p>
        ) : (
          <ol className="mt-4 space-y-3">
            {timeline.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="text-sm font-semibold text-[#13203F]">{item.message}</p>
                  <span className="text-xs text-slate-500">
                    {displayDate(item.createdAt)}
                  </span>
                </div>
                {item.meta?.remarks ? (
                  <p className="mt-2 text-sm text-slate-600">
                    Remarks: {item.meta.remarks}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
