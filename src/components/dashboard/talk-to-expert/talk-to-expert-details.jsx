"use client";

import { use, useState } from "react";
import {
  HiBuildingStorefront,
  HiCalendarDays,
  HiClock,
  HiCreditCard,
  HiUserCircle,
} from "react-icons/hi2";
import {
  DetailErrorState,
  DetailField,
  DetailHeader,
  DetailLoadingState,
  formatDetailDate,
  formatDetailLabel,
  getInitials,
  InfoCard,
  useDashboardDetail,
} from "@/components/dashboard/shared/record-details";
import { fetchExpertBookingById, updateExpertBookingStatus } from "@/lib/dashboard-api";
import { pickExpertBooking } from "@/lib/dashboard-detail-pickers";
import { ApiError } from "@/lib/api";

function StatusBadge({ status }) {
  const styles = {
    new: "bg-blue-50 text-blue-700 ring-blue-200",
    contacted: "bg-amber-50 text-amber-700 ring-amber-200",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-slate-50 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 ${
        styles[status] || styles.new
      }`}
    >
      {status || "new"}
    </span>
  );
}

function isPlaceholderSlotLabel(value) {
  if (!value) return true;
  const normalized = String(value).trim().toLowerCase();
  return (
    normalized === "scheduled via calendly" ||
    normalized === "see calendly confirmation" ||
    normalized === "—"
  );
}

function formatScheduledDisplay(data) {
  if (data.scheduledAt) {
    const date = new Date(data.scheduledAt);
    if (!Number.isNaN(date.getTime())) {
      return {
        dateLabel: date.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        timeLabel: date.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
        }),
        hasExactTime: true,
      };
    }
  }

  const hasDate = !isPlaceholderSlotLabel(data.slotDateLabel);
  const hasTime = !isPlaceholderSlotLabel(data.slotTime);

  return {
    dateLabel: hasDate ? data.slotDateLabel : null,
    timeLabel: hasTime ? data.slotTime : null,
    hasExactTime: hasDate && hasTime,
  };
}

function extractCalendlyRef(uri) {
  if (!uri) return null;
  const parts = String(uri).split("/").filter(Boolean);
  const id = parts[parts.length - 1];
  if (!id || id.length < 8) return null;
  return `${id.slice(0, 8)}…`;
}

function ScheduledSlotCard({ data }) {
  const isCalendly = data.bookingSource === "calendly" || Boolean(data.calendlyEventUri);
  const { dateLabel, timeLabel, hasExactTime } = formatScheduledDisplay(data);
  const eventRef = extractCalendlyRef(data.calendlyEventUri);
  const inviteeRef = extractCalendlyRef(data.calendlyInviteeUri);

  return (
    <InfoCard title="Scheduled Slot" icon={HiCalendarDays}>
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#2D4CC8]/15 bg-gradient-to-br from-[#EEF2FC] to-white p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${
                isCalendly
                  ? "bg-white text-[#2D4CC8] ring-[#2D4CC8]/20"
                  : "bg-white text-slate-600 ring-slate-200"
              }`}
            >
              {isCalendly ? "Booked via Calendly" : "Manual booking"}
            </span>
            <StatusBadge status={data.status} />
          </div>

          {hasExactTime ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-white text-[#2D4CC8] shadow-sm ring-1 ring-[#2D4CC8]/10">
                  <HiCalendarDays className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </p>
                  <p className="mt-0.5 text-base font-bold text-[#13203F]">{dateLabel}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-white text-[#40C3CF] shadow-sm ring-1 ring-[#40C3CF]/15">
                  <HiClock className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Time
                  </p>
                  <p className="mt-0.5 text-base font-bold text-[#13203F]">{timeLabel}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-base font-bold text-[#13203F]">
                {isCalendly ? "Confirmed in Calendly" : "Slot details unavailable"}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {isCalendly
                  ? "The invitee picked a time in Calendly. Exact date/time is in their Calendly confirmation email."
                  : "No scheduled date or time was saved for this booking."}
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailField label="Submitted">{formatDetailDate(data.createdAt)}</DetailField>
          <DetailField label="Scheduled At">
            {data.scheduledAt ? formatDetailDate(data.scheduledAt) : "—"}
          </DetailField>
          {eventRef ? (
            <DetailField label="Calendly Event Ref">
              <a
                href={data.calendlyEventUri}
                target="_blank"
                rel="noreferrer"
                className="text-[#2D4CC8] underline-offset-2 hover:underline"
                title={data.calendlyEventUri}
              >
                {eventRef}
              </a>
            </DetailField>
          ) : null}
          {inviteeRef ? (
            <DetailField label="Calendly Invitee Ref">
              <a
                href={data.calendlyInviteeUri}
                target="_blank"
                rel="noreferrer"
                className="text-[#2D4CC8] underline-offset-2 hover:underline"
                title={data.calendlyInviteeUri}
              >
                {inviteeRef}
              </a>
            </DetailField>
          ) : null}
        </div>
      </div>
    </InfoCard>
  );
}

export function TalkToExpertDetails({ params }) {
  const { id } = use(params);
  const { data, isLoading, error, reload } = useDashboardDetail(
    id,
    fetchExpertBookingById,
    pickExpertBooking,
  );
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatus(status) {
    setIsUpdating(true);
    setActionError("");
    setActionMessage("");
    try {
      const result = await updateExpertBookingStatus(id, status);
      setActionMessage(result.message || "Status updated");
      reload();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) return <DetailLoadingState />;
  if (error || !data) {
    return (
      <DetailErrorState
        message={error || "Expert booking not found"}
        onRetry={reload}
        backHref="/dashboard/talk-to-expert"
        backLabel="Back to Talk to Expert"
      />
    );
  }

  return (
    <div className="space-y-5">
      <DetailHeader
        backHref="/dashboard/talk-to-expert"
        backLabel="Back to Talk to Expert"
        title={data.fullName}
        subtitle={data.businessName}
        initials={getInitials(data.fullName)}
        badges={[<StatusBadge key="status" status={data.status} />]}
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

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[#13203F]">Update booking status</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {["new", "contacted", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              type="button"
              disabled={isUpdating || data.status === status}
              onClick={() => handleStatus(status)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold capitalize text-slate-700 disabled:opacity-50"
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="Visitor Details" icon={HiUserCircle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Full Name">{data.fullName}</DetailField>
            <DetailField label="Business Name">{data.businessName}</DetailField>
            <DetailField label="Email">{data.email}</DetailField>
            <DetailField label="Phone">{data.phone}</DetailField>
            <DetailField label="Website">{data.website || "—"}</DetailField>
            <DetailField label="Submitted">{formatDetailDate(data.createdAt)}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Business Context" icon={HiBuildingStorefront}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Industry">{formatDetailLabel(data.industry)}</DetailField>
            <DetailField label="Priority">{formatDetailLabel(data.priority)}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Payment Gateway" icon={HiCreditCard}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Gateway">{data.paymentGatewayName || "—"}</DetailField>
            <DetailField label="Representative">{data.representativeName || "—"}</DetailField>
            <DetailField label="Rep Title">{data.representativeTitle || "—"}</DetailField>
          </div>
        </InfoCard>

        <ScheduledSlotCard data={data} />
      </div>
    </div>
  );
}
