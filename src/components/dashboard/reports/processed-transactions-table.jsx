"use client";

import { useCallback, useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import {
  deleteProcessedTransaction,
  fetchProcessedTransactions,
} from "@/lib/reports-api";

function formatAmount(value) {
  if (value == null || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return String(value);
}

export function ProcessedTransactionsTable({
  batchId,
  title = "Processed Transactions",
  refreshToken = 0,
}) {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchProcessedTransactions({
        page,
        limit,
        search: debouncedSearch || undefined,
        batchId: batchId || undefined,
      });
      setTransactions(data.transactions || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load transactions");
      setTransactions([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [batchId, debouncedSearch, page]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions, refreshToken]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, batchId]);

  async function handleDelete(row) {
    const label = row.txnId || row.mid || "this transaction";
    if (
      !window.confirm(
        `Delete transaction ${label}? This removes it from reports and cannot be undone.`,
      )
    ) {
      return;
    }

    setActionError("");
    setDeletingId(row.id);
    try {
      await deleteProcessedTransaction(row.id);
      if (transactions.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadTransactions();
      }
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to delete transaction",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#13203F]">{title}</h3>
          <p className="mt-1 text-xs text-slate-600">
            {total} successful transaction{total === 1 ? "" : "s"} saved from uploads.
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search txn ID, MID, merchant, PG…"
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20 sm:max-w-xs"
        />
      </div>

      {actionError ? (
        <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      {error ? (
        <div className="px-5 py-4 text-sm text-red-700">{error}</div>
      ) : isLoading ? (
        <div className="px-5 py-8 text-sm text-slate-500">Loading transactions…</div>
      ) : transactions.length === 0 ? (
        <div className="px-5 py-8 text-sm text-slate-500">
          No successful transactions yet. Upload a file to populate this list.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">PG Name</th>
                <th className="px-4 py-3">MID</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">CompareX Revenue</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Payment Mode</th>
                <th className="px-4 py-3">Merchant</th>
                <th className="px-4 py-3">PG Revenue</th>
                <th className="px-4 py-3">Reseller Revenue</th>
                <th className="px-4 py-3">Saved At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-[#13203F]">{row.txnId || "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{row.transactionDate || "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{row.pgName || "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{row.mid || "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{formatAmount(row.amount)}</td>
                  <td className="px-4 py-3 text-emerald-700">{formatAmount(row.comparexRevenue)}</td>
                  <td className="px-4 py-3 text-[#2D4CC8]">{formatAmount(row.resellerCommission)}</td>
                  <td className="px-4 py-3 text-slate-700">{row.paymentMode || "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{row.merchantName || "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{row.pgRevenue || "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{row.resellerRevenue || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      disabled={deletingId === row.id}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Delete transaction ${row.txnId || row.id}`}
                    >
                      <HiTrash className="size-3.5" aria-hidden />
                      {deletingId === row.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm">
          <p className="text-slate-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || isLoading}
              className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages || isLoading}
              className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
