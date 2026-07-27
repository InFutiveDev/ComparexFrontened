"use client";

import { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { updateMerchantAdmin } from "@/lib/dashboard-api";

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

export function MerchantNotesModal({ row, onClose, onSaved }) {
  const [notes, setNotes] = useState(row?.qualificationNotes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setNotes(row?.qualificationNotes || "");
    setError("");
  }, [row]);

  if (!row) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await updateMerchantAdmin(row.id, { qualificationNotes: notes });
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
          placeholder="Add qualification notes, follow-up summary, or next steps"
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
