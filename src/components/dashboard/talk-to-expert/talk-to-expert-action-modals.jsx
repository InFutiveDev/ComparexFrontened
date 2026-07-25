"use client";

import { useEffect, useMemo, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import {
  fetchPaymentGatewayById,
  fetchPaymentGateways,
  updateExpertBooking,
} from "@/lib/dashboard-api";
import { mapPaymentGatewayListResponse } from "@/lib/dashboard-mappers";
import { pickPaymentGateway } from "@/lib/dashboard-detail-pickers";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#13203F]/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-[#13203F]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-[#13203F]"
            aria-label="Close"
          >
            <HiXMark className="size-5" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function TalkToExpertNotesModal({ row, onClose, onSaved }) {
  const [notes, setNotes] = useState(row?.adminNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNotes(row?.adminNotes || "");
    setError("");
  }, [row]);

  if (!row) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await updateExpertBooking(row.id, { adminNotes: notes });
      onSaved?.(result.message || "Notes saved");
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save notes");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalShell title="Notes" onClose={onClose}>
      <p className="mb-4 text-sm text-slate-600">
        Add internal notes for{" "}
        <span className="font-semibold text-[#13203F]">{row.name}</span>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className={`${inputClass} min-h-[140px] resize-y`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Add follow-up notes, call summary, or next steps"
          disabled={isSubmitting}
        />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-[#13203F] transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded-full bg-[#2D4CC8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243da8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save Notes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function TalkToExpertAssignModal({ row, onClose, onSaved }) {
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [experts, setExperts] = useState([]);
  const [paymentGatewayId, setPaymentGatewayId] = useState(row?.paymentGatewayId || "");
  const [expertId, setExpertId] = useState(row?.expertId || "");
  const [assignee, setAssignee] = useState(
    row?.assignee && row.assignee !== "Unassigned" ? row.assignee : "",
  );
  const [isLoadingGateways, setIsLoadingGateways] = useState(true);
  const [isLoadingExperts, setIsLoadingExperts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!row) return;

    setPaymentGatewayId(row.paymentGatewayId || "");
    setExpertId(row.expertId || "");
    setAssignee(row.assignee && row.assignee !== "Unassigned" ? row.assignee : "");
    setError("");

    let cancelled = false;

    async function loadPaymentGateways() {
      setIsLoadingGateways(true);

      try {
        const response = await fetchPaymentGateways({ page: 1, limit: 100 });
        const { rows } = mapPaymentGatewayListResponse(response);

        if (!cancelled) {
          setPaymentGateways(rows);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load payment gateways");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingGateways(false);
        }
      }
    }

    loadPaymentGateways();

    return () => {
      cancelled = true;
    };
  }, [row]);

  useEffect(() => {
    if (!paymentGatewayId) {
      setExperts([]);
      setExpertId("");
      return;
    }

    let cancelled = false;

    async function loadExperts() {
      setIsLoadingExperts(true);

      try {
        const response = await fetchPaymentGatewayById(paymentGatewayId);
        const gateway = pickPaymentGateway(response);
        const gatewayExperts = Array.isArray(gateway?.onboarding?.experts)
          ? gateway.onboarding.experts.filter((expert) => expert.status !== "inactive")
          : [];

        if (!cancelled) {
          setExperts(gatewayExperts);
          setExpertId((current) =>
            gatewayExperts.some((expert) => expert.id === current) ? current : "",
          );
        }
      } catch {
        if (!cancelled) {
          setExperts([]);
          setExpertId("");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingExperts(false);
        }
      }
    }

    loadExperts();

    return () => {
      cancelled = true;
    };
  }, [paymentGatewayId]);

  const selectedGatewayName = useMemo(
    () => paymentGateways.find((gateway) => gateway.id === paymentGatewayId)?.name || "",
    [paymentGatewayId, paymentGateways],
  );

  if (!row) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!paymentGatewayId) {
      setError("Select a payment gateway to assign this booking.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await updateExpertBooking(row.id, {
        paymentGatewayId,
        expertId: expertId || undefined,
        assignee: assignee.trim() || undefined,
      });
      onSaved?.(result.message || `Assigned to ${selectedGatewayName || "payment gateway"}`);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to assign booking");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalShell title="Assign Booking" onClose={onClose}>
      <p className="mb-4 text-sm text-slate-600">
        Assign <span className="font-semibold text-[#13203F]">{row.name}</span> to a payment
        gateway team member.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Assignee
          </label>
          <input
            className={inputClass}
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            placeholder="Admin or coordinator name"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Payment Gateway
          </label>
          <select
            className={inputClass}
            value={paymentGatewayId}
            onChange={(event) => setPaymentGatewayId(event.target.value)}
            disabled={isLoadingGateways || isSubmitting}
          >
            <option value="">
              {isLoadingGateways ? "Loading payment gateways…" : "Select payment gateway"}
            </option>
            {paymentGateways.map((gateway) => (
              <option key={gateway.id} value={gateway.id}>
                {gateway.name}
              </option>
            ))}
          </select>
        </div>

        {paymentGatewayId ? (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              PG Expert (optional)
            </label>
            <select
              className={inputClass}
              value={expertId}
              onChange={(event) => setExpertId(event.target.value)}
              disabled={isLoadingExperts || isSubmitting}
            >
              <option value="">
                {isLoadingExperts
                  ? "Loading experts…"
                  : experts.length > 0
                    ? "Select expert"
                    : "No experts available"}
              </option>
              {experts.map((expert) => (
                <option key={expert.id} value={expert.id}>
                  {expert.name}
                  {expert.designation ? ` · ${expert.designation}` : ""}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-[#13203F] transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingGateways}
            className="cursor-pointer rounded-full bg-[#2D4CC8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243da8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Assigning…" : "Assign"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
