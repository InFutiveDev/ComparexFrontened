"use client";

import Link from "next/link";
import {
  HiArrowLeft,
  HiBuildingOffice2,
  HiCalendarDays,
  HiChartBar,
  HiEnvelope,
  HiPhone,
  HiSparkles,
  HiTag,
  HiUserCircle,
  HiUserPlus,
} from "react-icons/hi2";

const statusStyles = {
  New: "bg-[#25a36f]/12 text-[#25a36f]",
  Qualified: "bg-[#40C3CF]/15 text-[#0f766e]",
  Proposal: "bg-amber-100 text-amber-700",
  Won: "bg-[#2D4CC8]/10 text-[#2D4CC8]",
};

const priorityStyles = {
  Hot: "bg-red-50 text-red-600 ring-red-100",
  Warm: "bg-amber-50 text-amber-700 ring-amber-100",
  Cold: "bg-slate-100 text-slate-600 ring-slate-200",
};

const activityTimeline = [
  { id: 1, title: "PG inquiry received", detail: "Submitted via payment gateway form", time: "3 days ago" },
  { id: 2, title: "Assigned to PG team", detail: "Routed to payment specialist", time: "2 days ago" },
  { id: 3, title: "Requirements captured", detail: "Volume, MDR, and settlement discussed", time: "1 day ago" },
  { id: 4, title: "Status updated", detail: "Moved to PG evaluation pipeline", time: "6 hours ago" },
];

function StatusBadge({ status }) {
  const className = statusStyles[status] ?? "bg-slate-100 text-slate-600";

  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide ${className}`}>
      {status.toUpperCase()}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const className = priorityStyles[priority] ?? "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${className}`}>
      {priority}
    </span>
  );
}

function DetailField({ label, children }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-[#13203F]">{children}</div>
    </div>
  );
}

function InfoCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-[#EEF2FC] text-[#2D4CC8]">
          <Icon className="size-5" aria-hidden />
        </span>
        <h2 className="text-base font-bold text-[#13203F]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function PaymentGatewayDetails({ paymentGateway }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard/payment-gateways"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#13203F] transition hover:border-[#2D4CC8]/30 hover:bg-slate-50"
        >
          <HiArrowLeft className="size-4 text-[#2D4CC8]" aria-hidden />
          Back to Payment Gateways
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-[#EEF2FC] via-white to-[#ecfdf5] px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
                style={{ backgroundColor: paymentGateway.assigneeColor }}
              >
                {paymentGateway.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  PG Lead ID: {paymentGateway.id}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-[#13203F] sm:text-3xl">{paymentGateway.name}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                  <HiBuildingOffice2 className="size-4 text-[#2D4CC8]" aria-hidden />
                  {paymentGateway.company}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={paymentGateway.status} />
                  <PriorityBadge priority={paymentGateway.priority} />
                  <span className="inline-flex rounded-full bg-[#EEF2FC] px-3 py-1 text-xs font-medium text-[#2D4CC8] ring-1 ring-[#2D4CC8]/10">
                    {paymentGateway.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${paymentGateway.phone}`}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#2D4CC8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2542b6]"
              >
                <HiPhone className="size-4" aria-hidden />
                Call
              </a>
              <a
                href={`mailto:${paymentGateway.email}`}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#13203F] transition hover:bg-slate-50"
              >
                <HiEnvelope className="size-4 text-[#40C3CF]" aria-hidden />
                Email
              </a>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#25a36f]/30 bg-[#25a36f]/10 px-4 py-2.5 text-sm font-semibold text-[#25a36f] transition hover:bg-[#25a36f]/15"
              >
                <HiUserPlus className="size-4" aria-hidden />
                Assign PG Lead
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
            <p className="text-xs font-medium text-slate-500">Lead Score</p>
            <p className="mt-1 text-2xl font-bold text-[#13203F]">{paymentGateway.score}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
            <p className="text-xs font-medium text-slate-500">Source</p>
            <p className="mt-1 text-lg font-bold text-[#13203F]">{paymentGateway.source}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
            <p className="text-xs font-medium text-slate-500">Work Type</p>
            <p className="mt-1 text-lg font-bold text-[#13203F]">{paymentGateway.workType}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
            <p className="text-xs font-medium text-slate-500">Assignee</p>
            <p className="mt-1 text-lg font-bold text-[#13203F]">{paymentGateway.assignee}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <InfoCard title="Contact Information" icon={HiUserCircle}>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField label="Full Name">{paymentGateway.name}</DetailField>
              <DetailField label="Company">{paymentGateway.company}</DetailField>
              <DetailField label="Phone Number">
                <a href={`tel:${paymentGateway.phone}`} className="text-[#2D4CC8] hover:underline">
                  {paymentGateway.phone}
                </a>
              </DetailField>
              <DetailField label="Email Address">
                <a href={`mailto:${paymentGateway.email}`} className="text-[#40C3CF] hover:underline">
                  {paymentGateway.email}
                </a>
              </DetailField>
            </div>
          </InfoCard>

          <InfoCard title="PG Profile" icon={HiTag}>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField label="Category">{paymentGateway.category}</DetailField>
              <DetailField label="Work Type">{paymentGateway.workType}</DetailField>
              <DetailField label="Lead Source">{paymentGateway.source}</DetailField>
              <DetailField label="Priority">
                <PriorityBadge priority={paymentGateway.priority} />
              </DetailField>
            </div>
          </InfoCard>

          <InfoCard title="Activity Timeline" icon={HiCalendarDays}>
            <div className="space-y-4">
              {activityTimeline.map((item, index) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="flex size-2.5 rounded-full bg-[#2D4CC8]" />
                    {index < activityTimeline.length - 1 ? (
                      <span className="mt-1 h-full w-px flex-1 bg-slate-200" />
                    ) : null}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-semibold text-[#13203F]">{item.title}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{item.detail}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>

        <div className="space-y-5">
          <InfoCard title="Assignment" icon={HiUserPlus}>
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
              <div
                className="flex size-11 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: paymentGateway.assigneeColor }}
              >
                {paymentGateway.assigneeInitials}
              </div>
              <div>
                <p className="text-sm font-bold text-[#13203F]">{paymentGateway.assignee}</p>
                <p className="text-xs text-slate-500">PG specialist</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 w-full cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#13203F] transition hover:bg-slate-50"
            >
              Reassign PG Lead
            </button>
          </InfoCard>

          <InfoCard title="Lead Insights" icon={HiChartBar}>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Lead Score</span>
                  <span className="text-[#13203F]">{paymentGateway.score}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF]"
                    style={{ width: `${paymentGateway.score}%` }}
                  />
                </div>
              </div>
              <DetailField label="Pipeline Status">
                <StatusBadge status={paymentGateway.status} />
              </DetailField>
              <DetailField label="Engagement">
                {paymentGateway.priority === "Hot"
                  ? "High intent — share PG comparison within 24 hours"
                  : paymentGateway.priority === "Warm"
                    ? "Moderate intent — schedule PG demo call"
                    : "Early stage — share PG onboarding checklist"}
              </DetailField>
            </div>
          </InfoCard>

          <InfoCard title="Quick Notes" icon={HiSparkles}>
            <p className="text-sm leading-relaxed text-slate-600">
              {paymentGateway.name} from {paymentGateway.company} is evaluating payment gateway options in the{" "}
              <span className="font-semibold text-[#13203F]">{paymentGateway.category}</span> segment.
              Lead originated from <span className="font-semibold text-[#13203F]">{paymentGateway.source}</span>.
            </p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
