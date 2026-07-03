"use client";

import Link from "next/link";
import {
  HiArrowLeft,
  HiBuildingOffice2,
  HiCalendarDays,
  HiEnvelope,
  HiPhone,
  HiSparkles,
  HiTag,
  HiUserCircle,
  HiUserPlus,
} from "react-icons/hi2";
import { getIndustryLabel, getPriorityLabel } from "@/lib/merchant-support-options";

const statusStyles = {
  New: "bg-[#25a36f]/12 text-[#25a36f]",
  Qualified: "bg-[#40C3CF]/15 text-[#0f766e]",
  Proposal: "bg-amber-100 text-amber-700",
  Won: "bg-[#2D4CC8]/10 text-[#2D4CC8]",
};

function StatusBadge({ status }) {
  const className = statusStyles[status] ?? "bg-slate-100 text-slate-600";

  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide ${className}`}>
      {status.toUpperCase()}
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

function formatSubmittedAt(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function MerchantSupportDetails({ submission }) {
  const industryLabel = submission.industryLabel ?? getIndustryLabel(submission.industry);
  const priorityLabel = submission.priorityLabel ?? getPriorityLabel(submission.priority);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard/merchant-support"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#13203F] transition hover:border-[#2D4CC8]/30 hover:bg-slate-50"
        >
          <HiArrowLeft className="size-4 text-[#2D4CC8]" aria-hidden />
          Back to Merchant Support
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-[#EEF2FC] via-white to-[#ecfdf5] px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#2D4CC8] text-lg font-bold text-white shadow-md">
                {submission.businessName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Request ID: {submission.id}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-[#13203F] sm:text-3xl">
                  {submission.businessName}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                  <HiBuildingOffice2 className="size-4 text-[#2D4CC8]" aria-hidden />
                  Home page PG advice form
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={submission.status} />
                  <span className="inline-flex rounded-full bg-[#EEF2FC] px-3 py-1 text-xs font-medium text-[#2D4CC8] ring-1 ring-[#2D4CC8]/10">
                    {industryLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${submission.phone}`}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#2D4CC8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2542b6]"
              >
                <HiPhone className="size-4" aria-hidden />
                Call
              </a>
              <a
                href={`mailto:${submission.email}`}
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
                Assign Request
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
            <p className="text-xs font-medium text-slate-500">Industry</p>
            <p className="mt-1 text-lg font-bold text-[#13203F]">{industryLabel}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
            <p className="text-xs font-medium text-slate-500">Top Priority</p>
            <p className="mt-1 text-lg font-bold text-[#13203F]">{priorityLabel}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
            <p className="text-xs font-medium text-slate-500">Source</p>
            <p className="mt-1 text-lg font-bold text-[#13203F]">{submission.source}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
            <p className="text-xs font-medium text-slate-500">Submitted</p>
            <p className="mt-1 text-lg font-bold text-[#13203F]">
              {formatSubmittedAt(submission.submittedAt)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <InfoCard title="Contact Information" icon={HiUserCircle}>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField label="Business Name">{submission.businessName}</DetailField>
              <DetailField label="Phone Number">
                <a href={`tel:${submission.phone}`} className="text-[#2D4CC8] hover:underline">
                  {submission.phone}
                </a>
              </DetailField>
              <DetailField label="Email Address">
                <a href={`mailto:${submission.email}`} className="text-[#40C3CF] hover:underline">
                  {submission.email}
                </a>
              </DetailField>
              <DetailField label="Submitted At">
                {formatSubmittedAt(submission.submittedAt)}
              </DetailField>
            </div>
          </InfoCard>

          <InfoCard title="Form Responses" icon={HiTag}>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField label="Industry">{industryLabel}</DetailField>
              <DetailField label="Business Priority">{priorityLabel}</DetailField>
              <DetailField label="Form Source">{submission.source}</DetailField>
              <DetailField label="Status">
                <StatusBadge status={submission.status} />
              </DetailField>
            </div>
          </InfoCard>
        </div>

        <div className="space-y-5">
          <InfoCard title="Assignment" icon={HiUserPlus}>
            <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4">
              <p className="text-sm font-bold text-[#13203F]">Unassigned</p>
              <p className="text-xs text-slate-500">Awaiting support team review</p>
            </div>
            <button
              type="button"
              className="mt-4 w-full cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#13203F] transition hover:bg-slate-50"
            >
              Assign to Agent
            </button>
          </InfoCard>

          <InfoCard title="Support Notes" icon={HiSparkles}>
            <p className="text-sm leading-relaxed text-slate-600">
              This request was submitted through the home page PG advice form. The merchant is
              looking for recommendations in{" "}
              <span className="font-semibold text-[#13203F]">{industryLabel}</span> with priority on{" "}
              <span className="font-semibold text-[#13203F]">{priorityLabel}</span>.
            </p>
          </InfoCard>

          <InfoCard title="Next Steps" icon={HiCalendarDays}>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Review business fit and transaction profile</li>
              <li>Shortlist suitable payment gateways</li>
              <li>Schedule a callback within SLA</li>
            </ul>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
