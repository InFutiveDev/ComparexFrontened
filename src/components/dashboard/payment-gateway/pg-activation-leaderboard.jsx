"use client";

import { useMemo } from "react";
import { HiTrophy } from "react-icons/hi2";
import { buildPgActivationLeaders } from "@/lib/dashboard-mappers";

const rankStyles = {
  1: "bg-amber-100 text-amber-700 ring-amber-200",
  2: "bg-slate-100 text-slate-700 ring-slate-200",
  3: "bg-orange-50 text-orange-700 ring-orange-200",
};

export function PgActivationLeaderboard({ rows = [], isLoading = false }) {
  const leaders = useMemo(() => buildPgActivationLeaders(rows, 8), [rows]);

  const maxActivations = useMemo(() => {
    if (leaders.length === 0) return 1;
    return Math.max(1, ...leaders.map((item) => item.activations));
  }, [leaders]);

  return (
    <article className="flex h-full min-h-[420px] flex-col rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FC] text-[#2D4CC8]">
          <HiTrophy className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-bold text-[#13203F]">PG leader dashboard</h3>
          <p className="mt-1 text-sm text-slate-500">
            Ranked by merchant activations (live onboardings) across payment gateways.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : leaders.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
          No activation data yet. Leaderboard updates as PGs onboard merchants.
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto pr-1">
          {leaders.map((leader) => {
            const widthPercent = Math.round((leader.activations / maxActivations) * 100);
            const rankClass = rankStyles[leader.rank] ?? "bg-[#EEF2FC] text-[#2D4CC8] ring-[#2D4CC8]/15";

            return (
              <li
                key={leader.id}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:border-[#2D4CC8]/20 hover:bg-white"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 ${rankClass}`}
                  >
                    #{leader.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="truncate font-semibold text-[#13203F]">{leader.name}</p>
                      <p className="text-sm font-bold text-[#25a36f]">
                        {leader.activations} live
                      </p>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#25a36f]"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {leader.acceptedLeads} accepted leads · {leader.activationRate} activation rate
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
