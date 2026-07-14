"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiCalendarDays,
  HiClock,
  HiCreditCard,
  HiUserCircle,
} from "react-icons/hi2";
import {
  DetailField,
  DetailHeader,
  DetailLoadingState,
  formatDetailDate,
  formatDetailLabel,
  getInitials,
  InfoCard,
} from "@/components/dashboard/shared/record-details";
import { LeadStatusBadge } from "@/components/sub-admin/leads-table";
import { ApiError } from "@/lib/api";
import {
  LEAD_STATUS_OPTIONS,
  assignSubAdminLeadToPg,
  bookSubAdminTalkToExpert,
  fetchAssignablePaymentGateways,
  fetchSubAdminLeadById,
  updateSubAdminLeadStatus,
} from "@/lib/sub-admin";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

export function LeadDetails({ params }) {
  const { id } = use(params);
  const [lead, setLead] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");

  const [pgFilters, setPgFilters] = useState({
    search: "",
    location: "",
    category: "",
    minSuccessRate: "",
    minSettlementScore: "",
  });
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [selectedPgId, setSelectedPgId] = useState("");
  const [assignNotes, setAssignNotes] = useState("");
  const [loadingPgs, setLoadingPgs] = useState(false);

  const [expertForm, setExpertForm] = useState({
    preferredDate: "",
    preferredTime: "",
    timezone: "Asia/Kolkata",
    notes: "",
  });

  const loadLead = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchSubAdminLeadById(id);
      setLead(data.lead);
      setTimeline(data.timeline || []);
      setStatus(data.lead?.leadStatus || "new");
      setNotes(data.lead?.qualificationNotes || "");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load lead");
      setLead(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadPgs = useCallback(async () => {
    setLoadingPgs(true);
    try {
      const data = await fetchAssignablePaymentGateways({
        page: 1,
        limit: 50,
        search: pgFilters.search || undefined,
        location: pgFilters.location || undefined,
        category: pgFilters.category || undefined,
        minSuccessRate: pgFilters.minSuccessRate || undefined,
        minSettlementScore: pgFilters.minSettlementScore || undefined,
      });
      setPaymentGateways(data.paymentGateways || []);
    } catch {
      setPaymentGateways([]);
    } finally {
      setLoadingPgs(false);
    }
  }, [pgFilters]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  useEffect(() => {
    loadPgs();
  }, [loadPgs]);

  async function handleStatusUpdate() {
    setIsUpdating(true);
    setActionError("");
    setActionMessage("");
    try {
      const data = await updateSubAdminLeadStatus(id, { status, notes });
      setLead(data.lead);
      setTimeline(data.timeline || []);
      setActionMessage(data.message || "Lead status updated");
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleAssign() {
    if (!selectedPgId) {
      setActionError("Select a payment gateway to assign");
      return;
    }
    setIsUpdating(true);
    setActionError("");
    setActionMessage("");
    try {
      const data = await assignSubAdminLeadToPg(id, {
        paymentGatewayId: selectedPgId,
        notes: assignNotes,
      });
      setLead(data.lead);
      setTimeline(data.timeline || []);
      setActionMessage(data.message || "Lead assigned to payment gateway");
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to assign lead");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleTalkToExpert() {
    setIsUpdating(true);
    setActionError("");
    setActionMessage("");
    try {
      const data = await bookSubAdminTalkToExpert(id, {
        preferredDate: expertForm.preferredDate || undefined,
        preferredTime: expertForm.preferredTime || undefined,
        timezone: expertForm.timezone || undefined,
        notes: expertForm.notes || undefined,
        paymentGatewayId: selectedPgId || undefined,
      });
      setLead(data.lead);
      setTimeline(data.timeline || []);
      setActionMessage(data.message || "Talk to Expert booked");
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to book Talk to Expert");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) return <DetailLoadingState />;

  if (error || !lead) {
    return (
      <div className="space-y-4">
        <Link
          href="/sub-admin-dashboard/leads"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#13203F]"
        >
          <HiArrowLeft className="size-4 text-[#2D4CC8]" aria-hidden />
          Back to leads
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-10 text-center text-sm text-red-700">
          {error || "Lead not found"}
        </div>
      </div>
    );
  }

  const canAssign = lead.leadStatus === "qualified" || lead.leadStatus === "assigned";

  return (
    <div className="space-y-5">
      <DetailHeader
        backHref="/sub-admin-dashboard/leads"
        backLabel="Back to leads"
        title={lead.businessName}
        subtitle={lead.email}
        initials={getInitials(lead.businessName)}
        badges={[<LeadStatusBadge key="status" status={lead.leadStatus} />]}
      />

      {(actionError || actionMessage) && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            actionError
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {actionError || actionMessage}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="Merchant Lead" icon={HiUserCircle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Business Name">{lead.businessName}</DetailField>
            <DetailField label="Email">{lead.email}</DetailField>
            <DetailField label="Phone">{lead.phone}</DetailField>
            <DetailField label="Industry">{formatDetailLabel(lead.industry)}</DetailField>
            <DetailField label="Priority">{formatDetailLabel(lead.priority)}</DetailField>
            <DetailField label="Location">{lead.location || "—"}</DetailField>
            <DetailField label="Source">{lead.source || "—"}</DetailField>
            <DetailField label="Created">{formatDetailDate(lead.createdAt)}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Qualification (FR-SA-02)" icon={HiClock}>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Lead status
              </label>
              <select
                className={inputClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Qualification notes
              </label>
              <textarea
                className={inputClass}
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Review notes for this merchant lead"
              />
            </div>
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleStatusUpdate}
              className="rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ color: "#fff" }}
            >
              {isUpdating ? "Updating…" : "Update status"}
            </button>
          </div>
        </InfoCard>
      </div>

      <InfoCard title="Assign to Payment Gateway (FR-SA-04 / FR-SA-05)" icon={HiCreditCard}>
        {!canAssign ? (
          <p className="text-sm text-amber-700">
            Lead must be marked <strong>Qualified</strong> before assignment.
          </p>
        ) : null}

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className={inputClass}
            placeholder="Search PG"
            value={pgFilters.search}
            onChange={(e) => setPgFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
          <input
            className={inputClass}
            placeholder="Location"
            value={pgFilters.location}
            onChange={(e) => setPgFilters((prev) => ({ ...prev, location: e.target.value }))}
          />
          <input
            className={inputClass}
            placeholder="Category / capability"
            value={pgFilters.category}
            onChange={(e) => setPgFilters((prev) => ({ ...prev, category: e.target.value }))}
          />
          <input
            className={inputClass}
            placeholder="Min success rate"
            value={pgFilters.minSuccessRate}
            onChange={(e) =>
              setPgFilters((prev) => ({ ...prev, minSuccessRate: e.target.value }))
            }
          />
          <input
            className={inputClass}
            placeholder="Min settlement score"
            value={pgFilters.minSettlementScore}
            onChange={(e) =>
              setPgFilters((prev) => ({ ...prev, minSettlementScore: e.target.value }))
            }
          />
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Select payment gateway {loadingPgs ? "(loading…)" : ""}
          </label>
          <select
            className={inputClass}
            value={selectedPgId}
            onChange={(e) => setSelectedPgId(e.target.value)}
          >
            <option value="">Choose PG…</option>
            {paymentGateways.map((pg) => (
              <option key={pg.id} value={pg.id}>
                {pg.companyName}
                {pg.location ? ` · ${pg.location}` : ""}
                {` · success ${pg.performance?.successRate ?? 0}%`}
                {` · settle ${pg.performance?.settlementScore ?? 0}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Assignment notes
          </label>
          <textarea
            className={inputClass}
            rows={2}
            value={assignNotes}
            onChange={(e) => setAssignNotes(e.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isUpdating || !canAssign}
            onClick={handleAssign}
            className="rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            Assign to PG
          </button>
          {lead.assignedPgName ? (
            <p className="self-center text-sm text-slate-600">
              Currently assigned to <strong>{lead.assignedPgName}</strong>
            </p>
          ) : null}
        </div>
      </InfoCard>

      <InfoCard title="Book Talk to Expert (FR-SA-04)" icon={HiCalendarDays}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="date"
            className={inputClass}
            value={expertForm.preferredDate}
            onChange={(e) =>
              setExpertForm((prev) => ({ ...prev, preferredDate: e.target.value }))
            }
          />
          <input
            type="time"
            className={inputClass}
            value={expertForm.preferredTime}
            onChange={(e) =>
              setExpertForm((prev) => ({ ...prev, preferredTime: e.target.value }))
            }
          />
          <input
            className={inputClass}
            placeholder="Timezone"
            value={expertForm.timezone}
            onChange={(e) => setExpertForm((prev) => ({ ...prev, timezone: e.target.value }))}
          />
          <input
            className={inputClass}
            placeholder="Notes"
            value={expertForm.notes}
            onChange={(e) => setExpertForm((prev) => ({ ...prev, notes: e.target.value }))}
          />
        </div>
        <button
          type="button"
          disabled={isUpdating}
          onClick={handleTalkToExpert}
          className="mt-4 rounded-full border border-[#2D4CC8] bg-white px-5 py-2.5 text-sm font-semibold text-[#2D4CC8] disabled:opacity-50"
        >
          Book Talk to Expert
        </button>
      </InfoCard>

      <InfoCard title="Activity Timeline (FR-SA-03)" icon={HiClock}>
        {timeline.length === 0 ? (
          <p className="text-sm text-slate-500">No activity recorded yet.</p>
        ) : (
          <ol className="space-y-3">
            {timeline.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#13203F]">{item.message}</p>
                  <span className="text-xs text-slate-500">
                    {formatDetailDate(item.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {item.type}
                  {item.actorName ? ` · ${item.actorName}` : ""}
                  {item.actorRole ? ` (${item.actorRole})` : ""}
                </p>
              </li>
            ))}
          </ol>
        )}
      </InfoCard>
    </div>
  );
}
