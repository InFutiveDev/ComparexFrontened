"use client";

import { useCallback, useEffect, useState } from "react";
import { HiArrowPath } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { fetchMyResellerInvoices, submitMyResellerInvoice, uploadResellerKycFile } from "@/lib/reseller";
import {
  StatusBadge,
  formatInr,
  formatShortDate,
  inputClass,
  invoiceStatusTone,
} from "@/lib/reseller-finance-ui";

export function ResellerInvoicesSection() {
  const [invoices, setInvoices] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    invoiceNumber: "",
    amount: "",
    periodStart: "",
    periodEnd: "",
    file: null,
  });
  const [fileInputKey, setFileInputKey] = useState(0);

  const loadInvoices = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyResellerInvoices({
        page,
        limit: 25,
        status: filterStatus || undefined,
      });
      setInvoices(data.invoices || []);
      setStatuses(data.statuses || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (!form.file) {
        throw new ApiError("Please upload an invoice file");
      }

      const uploaded = await uploadResellerKycFile(form.file, "reseller-invoices");
      await submitMyResellerInvoice({
        invoiceNumber: form.invoiceNumber.trim(),
        amount: Number(form.amount),
        periodStart: form.periodStart || undefined,
        periodEnd: form.periodEnd || undefined,
        invoiceFile: uploaded,
      });

      setMessage("Invoice submitted for payout review");
      setForm({
        invoiceNumber: "",
        amount: "",
        periodStart: "",
        periodEnd: "",
        file: null,
      });
      setFileInputKey((value) => value + 1);
      await loadInvoices();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit invoice");
    } finally {
      setIsSubmitting(false);
    }
  }

  const pages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Invoice & KYC Management
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          FR-RS-07 · Upload invoices for payout claims. FR-RS-08 · Track payment status for each
          invoice.
        </p>
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-[#13203F]">Submit payout invoice</p>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            className={inputClass}
            placeholder="Invoice number"
            value={form.invoiceNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
            required
          />
          <input
            className={inputClass}
            type="number"
            min="1"
            placeholder="Claim amount (INR)"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            required
          />
          <input
            type="date"
            className={inputClass}
            value={form.periodStart}
            onChange={(e) => setForm((prev) => ({ ...prev, periodStart: e.target.value }))}
          />
          <input
            type="date"
            className={inputClass}
            value={form.periodEnd}
            onChange={(e) => setForm((prev) => ({ ...prev, periodEnd: e.target.value }))}
          />
          <input
            key={fileInputKey}
            type="file"
            className={inputClass}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, file: e.target.files?.[0] ?? null }))
            }
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#2D4CC8] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {isSubmitting ? "Submitting…" : "Upload invoice"}
          </button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <select
            className={`${inputClass} max-w-xs`}
            value={filterStatus}
            onChange={(e) => {
              setPage(1);
              setFilterStatus(e.target.value);
            }}
          >
            <option value="">All payment statuses</option>
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={loadInvoices}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            <HiArrowPath className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">Invoice #</th>
                <th className="px-3 py-3">File</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Period</th>
                <th className="px-3 py-3">Payment status</th>
                <th className="px-3 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-slate-500">
                    No invoices submitted yet.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-semibold text-[#13203F]">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {invoice.invoiceFile?.url ? (
                        <a
                          href={invoice.invoiceFile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#2D4CC8] hover:underline"
                        >
                          {invoice.invoiceFile.fileName || "View file"}
                        </a>
                      ) : invoice.invoiceFile?.fileName ? (
                        <span>{invoice.invoiceFile.fileName}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{formatInr(invoice.amount)}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {formatShortDate(invoice.periodStart)} – {formatShortDate(invoice.periodEnd)}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge
                        label={invoice.paymentStatus.replace("_", " ")}
                        tone={invoiceStatusTone(invoice.paymentStatus)}
                      />
                    </td>
                    <td className="px-3 py-3 text-slate-600">{formatShortDate(invoice.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {page} of {pages} · {total} result{total === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => setPage((value) => Math.min(pages, value + 1))}
              className="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
