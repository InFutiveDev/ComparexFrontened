"use client";

import { useMemo } from "react";
import { computeSupportFlowAggregate } from "@/lib/support-flow";

function StageCard({ stage, index, isLast }) {
  const pct =
    stage.key === "created"
      ? 100
      : stage.totalRef > 0
        ? Math.round((stage.count / stage.totalRef) * 100)
        : 0;

  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      {!isLast ? (
        <div
          className="absolute left-[calc(50%+2rem)] right-0 top-8 hidden h-0.5 bg-gradient-to-r from-[#2D4CC8]/40 to-[#40C3CF]/40 lg:block"
          aria-hidden
        />
      ) : null}

      <div className="flex items-start gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2D4CC8] to-[#40C3CF] text-sm font-bold text-white shadow-md shadow-[#2D4CC8]/25"
          style={{ color: "#fff" }}
        >
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {stage.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-[#13203F]">{stage.count}</p>
          {stage.key !== "created" ? (
            <p className="mt-0.5 text-xs text-slate-500">
              {pct}% of tickets
              {stage.avgFromPrevious ? ` · ${stage.avgFromPrevious}` : ""}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-slate-500">All submissions in view</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Aggregate funnel — shown above the ticket list, not instead of it. */
export function SupportFlowFunnelSection({ rows = [], isLoading = false }) {
  const aggregate = useMemo(() => computeSupportFlowAggregate(rows), [rows]);
  const stages = aggregate.stages.map((stage) => ({ ...stage, totalRef: aggregate.total }));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-[#13203F]">Support flow funnel</h3>
        <p className="mt-1 text-sm text-slate-500">
          Ticket created → First Connect → PG response → Final Status. Per-ticket timestamps are on
          the detail page; the ticket list below is unchanged.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : aggregate.total === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No tickets yet — funnel metrics appear when support requests exist.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-4">
          {stages.map((stage, index) => (
            <StageCard
              key={stage.key}
              stage={stage}
              index={index}
              isLast={index === stages.length - 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}
