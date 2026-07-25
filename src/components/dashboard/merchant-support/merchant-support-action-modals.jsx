"use client";

import { useEffect, useState } from "react";
import { HiEnvelope, HiPhone, HiXMark } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import {
  escalateMerchantSupportToPg,
  fetchPaymentGateways,
} from "@/lib/dashboard-api";
import { mapPaymentGatewayListResponse } from "@/lib/dashboard-mappers";

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
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
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

export function MerchantSupportContactModal({ row, onClose }) {
  if (!row) return null;

  return (
    <ModalShell title="Contact Merchant" onClose={onClose}>
      <p className="mb-4 text-sm text-slate-600">
        Reach out to <span className="font-semibold text-[#13203F]">{row.name}</span> using
        the details below.
      </p>

      <div className="space-y-3">
        {row.phone ? (
          <a
            href={`tel:${row.phone}`}
            className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#13203F] transition hover:border-[#2D4CC8]/30 hover:bg-[#EEF2FC]"
          >
            <HiPhone className="size-5 text-[#2D4CC8]" aria-hidden />
            {row.phone}
          </a>
        ) : null}

        {row.email ? (
          <a
            href={`mailto:${row.email}`}
            className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#13203F] transition hover:border-[#40C3CF]/30 hover:bg-[#ecfdf9]"
          >
            <HiEnvelope className="size-5 text-[#40C3CF]" aria-hidden />
            <span className="truncate">{row.email}</span>
          </a>
        ) : null}

        {!row.phone && !row.email ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            No contact details available.
          </p>
        ) : null}
      </div>
    </ModalShell>
  );
}

export function MerchantSupportEscalateModal({ row, onClose, onEscalated }) {
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [paymentGatewayId, setPaymentGatewayId] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!row) return;

    let cancelled = false;

    async function loadPaymentGateways() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetchPaymentGateways({ page: 1, limit: 100 });
        const { rows } = mapPaymentGatewayListResponse(response);

        if (!cancelled) {
          setPaymentGateways(rows);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Failed to load payment gateways");
          setPaymentGateways([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPaymentGateways();

    return () => {
      cancelled = true;
    };
  }, [row]);

  if (!row) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!paymentGatewayId) {
      setError("Select a payment gateway to escalate this request.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await escalateMerchantSupportToPg(row.id, {
        paymentGatewayId,
        notes,
      });
      onEscalated?.(result.message || "Support request escalated");
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to escalate support request");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalShell title="Escalate to PG" onClose={onClose}>
      <p className="mb-4 text-sm text-slate-600">
        Escalate the support request from{" "}
        <span className="font-semibold text-[#13203F]">{row.name}</span>
        {row.paymentGateway ? (
          <>
            {" "}
            regarding <span className="font-semibold text-[#13203F]">{row.paymentGateway}</span>
          </>
        ) : null}{" "}
        to a payment gateway partner.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Payment Gateway
          </label>
          <select
            className={inputClass}
            value={paymentGatewayId}
            onChange={(event) => setPaymentGatewayId(event.target.value)}
            disabled={isLoading || isSubmitting}
          >
            <option value="">
              {isLoading ? "Loading payment gateways…" : "Select payment gateway"}
            </option>
            {paymentGateways.map((gateway) => (
              <option key={gateway.id} value={gateway.id}>
                {gateway.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Notes (optional)
          </label>
          <textarea
            className={`${inputClass} min-h-[96px] resize-y`}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add context for the PG team"
            disabled={isSubmitting}
          />
        </div>

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
            disabled={isSubmitting || isLoading}
            className="cursor-pointer rounded-full bg-[#2D4CC8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#243da8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Escalating…" : "Escalate to PG"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
