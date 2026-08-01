"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { formatMdrStatus, ONBOARDING_MDR_FIELD_BY_MODE } from "@/lib/mdr-public";
import {
  approveMyPgMdrChange,
  fetchMyPgMdrChanges,
  rejectMyPgMdrChange,
} from "@/lib/payment";

const MODE_LABELS = {
  upi: "UPI",
  credit_card: "Credit Card",
  debit_card: "Debit Card",
  international: "International",
  wallet: "Wallet",
  net_banking: "Net Banking",
  emi_bnpl: "EMI / BNPL",
};

function formatWhen(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function changedModes(beforeRates = {}, afterRates = {}) {
  return Object.keys(ONBOARDING_MDR_FIELD_BY_MODE).filter((mode) => {
    const prev = String(beforeRates[mode] ?? "").trim();
    const next = String(afterRates[mode] ?? "").trim();
    return prev !== next;
  });
}

function MdrDiffTable({ beforeRates, afterRates }) {
  const modes = changedModes(beforeRates, afterRates);
  if (modes.length === 0) {
    return (
      <p className="text-sm text-slate-500">No field-level differences recorded.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-2 font-semibold">Payment mode</th>
            <th className="px-3 py-2 font-semibold">Live on website</th>
            <th className="px-3 py-2 font-semibold">Proposed</th>
          </tr>
        </thead>
        <tbody>
          {modes.map((mode) => (
            <tr key={mode} className="border-t border-slate-100">
              <td className="px-3 py-2 font-medium text-[#13203F]">
                {MODE_LABELS[mode] || mode}
              </td>
              <td className="px-3 py-2 text-slate-600">
                {String(beforeRates[mode] || "").trim() || "—"}
              </td>
              <td className="px-3 py-2 font-semibold text-[#2D4CC8]">
                {String(afterRates[mode] || "").trim() || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PgMdrApprovalsSection() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [rejectNote, setRejectNote] = useState({});
  const [rejectOpenId, setRejectOpenId] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyPgMdrChanges(
        filter === "all" ? {} : { status: filter },
      );
      setLogs(data.logs || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load MDR requests");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(id) {
    setBusyId(id);
    setError("");
    setMessage("");
    try {
      const res = await approveMyPgMdrChange(id);
      setMessage(res.message || "Approved");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to approve");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id) {
    setBusyId(id);
    setError("");
    setMessage("");
    try {
      const res = await rejectMyPgMdrChange(id, rejectNote[id] || "");
      setMessage(res.message || "Rejected");
      setRejectOpenId(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to reject");
    } finally {
      setBusyId(null);
    }
  }

  const pendingCount = logs.filter((l) => l.status === "pending").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Website MDR approvals
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          CompareX admins may propose Merchant Discount Rates shown on the public payment gateway
          compare page. Review each change here — rates go live for merchants only after you
          approve.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "pending", label: "Pending" },
          { id: "approved", label: "Approved" },
          { id: "rejected", label: "Rejected" },
          { id: "all", label: "All" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === item.id
                ? "bg-[#2D4CC8] text-white"
                : "border border-slate-200 bg-white text-slate-600"
            }`}
            style={filter === item.id ? { color: "#fff" } : undefined}
          >
            {item.label}
            {item.id === "pending" && pendingCount > 0 && filter !== "pending" ? (
              <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] text-[#13203F]">
                {pendingCount}
              </span>
            ) : null}
          </button>
        ))}
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

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading MDR change requests…</p>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
          {filter === "pending"
            ? "No pending MDR updates. When an admin proposes new compare rates, they will appear here."
            : "No MDR change requests in this view."}
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => {
            const beforeRates = log.before?.rates || {};
            const afterRates = log.after?.rates || {};
            const isPending = log.status === "pending";

            return (
              <article
                key={log.id}
                className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {formatWhen(log.createdAt)}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{log.message}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Proposed by {log.actorName || log.actorEmail || "Admin"}
                      {log.actorEmail ? ` (${log.actorEmail})` : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      log.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : log.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {formatMdrStatus(log.status)}
                  </span>
                </div>

                <MdrDiffTable beforeRates={beforeRates} afterRates={afterRates} />

                {log.status === "approved" && log.reviewedAt ? (
                  <p className="text-xs text-slate-500">
                    Approved {formatWhen(log.reviewedAt)}
                    {log.reviewedByName ? ` by ${log.reviewedByName}` : ""}
                  </p>
                ) : null}

                {log.status === "rejected" ? (
                  <p className="text-xs text-slate-500">
                    Rejected {formatWhen(log.reviewedAt)}
                    {log.reviewNote ? ` — ${log.reviewNote}` : ""}
                  </p>
                ) : null}

                {isPending ? (
                  <div className="flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      disabled={busyId === log.id}
                      onClick={() => handleApprove(log.id)}
                      className="rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                      style={{ color: "#fff" }}
                    >
                      {busyId === log.id ? "Working…" : "Approve & publish on website"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRejectOpenId(rejectOpenId === log.id ? null : log.id)
                      }
                      className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                    >
                      Reject
                    </button>
                    {rejectOpenId === log.id ? (
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                          placeholder="Optional reason for rejection"
                          value={rejectNote[log.id] || ""}
                          onChange={(e) =>
                            setRejectNote((prev) => ({
                              ...prev,
                              [log.id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          type="button"
                          disabled={busyId === log.id}
                          onClick={() => handleReject(log.id)}
                          className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          Confirm reject
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
