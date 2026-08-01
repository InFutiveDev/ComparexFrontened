"use client";

import { HiCheckCircle, HiClock, HiMinusCircle } from "react-icons/hi2";
import { buildSupportFlowSteps } from "@/lib/support-flow";

const stateStyles = {
  complete: {
    ring: "border-emerald-200 bg-emerald-50",
    icon: HiCheckCircle,
    iconClass: "text-emerald-600",
    line: "bg-emerald-300",
  },
  pending: {
    ring: "border-amber-200 bg-amber-50",
    icon: HiClock,
    iconClass: "text-amber-600",
    line: "bg-amber-200",
  },
  skipped: {
    ring: "border-slate-200 bg-slate-50",
    icon: HiMinusCircle,
    iconClass: "text-slate-400",
    line: "bg-slate-200",
  },
};

export function SupportFlowTimeline({ ticket, title = "Support flow" }) {
  const steps = buildSupportFlowSteps(ticket);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#13203F]">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">Milestones with timestamps for this ticket.</p>

      <ol className="mt-6 space-y-0">
        {steps.map((step, index) => {
          const styles = stateStyles[step.state] ?? stateStyles.pending;
          const Icon = styles.icon;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast ? (
                <span
                  className={`absolute left-[1.125rem] top-10 h-[calc(100%-1.5rem)] w-0.5 ${styles.line}`}
                  aria-hidden
                />
              ) : null}

              <div
                className={`relative z-[1] flex size-9 shrink-0 items-center justify-center rounded-full border-2 ${styles.ring}`}
              >
                <Icon className={`size-5 ${styles.iconClass}`} aria-hidden />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-semibold text-[#13203F]">{step.label}</p>
                <p className="mt-1 text-sm text-slate-700">{step.atLabel}</p>
                {step.hint ? (
                  <p className="mt-1 text-xs text-slate-500">PG: {step.hint}</p>
                ) : null}
                {step.key === "finalStatus" && step.statusLabel && step.state !== "complete" ? (
                  <p className="mt-1 text-xs font-medium text-amber-700">
                    Current: {step.statusLabel}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
