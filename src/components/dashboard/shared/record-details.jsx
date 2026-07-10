"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiBuildingOffice2,
} from "react-icons/hi2";
import { ApiError } from "@/lib/api";

export function formatDetailLabel(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    return value.map(formatDetailLabel).join(", ");
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDetailDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function DetailField({ label, children }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-1 text-sm font-semibold text-[#13203F] break-words">{children}</div>
    </div>
  );
}

export function InfoCard({ title, icon: Icon, children }) {
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

export function AccountStatusBadge({ status }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
          : "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function DetailLoadingState() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center">
      <p className="text-sm font-semibold text-[#13203F]">Loading details...</p>
    </section>
  );
}

export function DetailErrorState({ message, onRetry, backHref, backLabel }) {
  return (
    <div className="space-y-4">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#13203F] transition hover:border-[#2D4CC8]/30 hover:bg-slate-50"
        >
          <HiArrowLeft className="size-4 text-[#2D4CC8]" aria-hidden />
          {backLabel}
        </Link>
      ) : null}
      <section className="rounded-2xl border border-red-200 bg-red-50 px-5 py-10 text-center">
        <p className="text-sm font-semibold text-red-700">{message}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2D4CC8] ring-1 ring-[#2D4CC8]/20"
          >
            Try again
          </button>
        ) : null}
      </section>
    </div>
  );
}

export function DetailHeader({
  backHref,
  backLabel,
  title,
  subtitle,
  badges = [],
  initials,
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#13203F] transition hover:border-[#2D4CC8]/30 hover:bg-slate-50"
        >
          <HiArrowLeft className="size-4 text-[#2D4CC8]" aria-hidden />
          {backLabel}
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-[#EEF2FC] via-white to-[#ecfdf5] px-5 py-6 sm:px-6">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#2D4CC8] text-lg font-bold text-white shadow-md">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#13203F] sm:text-3xl">{title}</h1>
              {subtitle ? (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                  <HiBuildingOffice2 className="size-4 text-[#2D4CC8]" aria-hidden />
                  {subtitle}
                </p>
              ) : null}
              {badges.length > 0 ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">{badges}</div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function useDashboardDetail(id, fetchById, pick) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await fetchById(id);
      setData(pick ? pick(response) : response);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load details");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [id, fetchById, pick]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}

export function getInitials(value) {
  return String(value || "CX")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
