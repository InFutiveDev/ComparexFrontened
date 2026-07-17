"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HiCalendarDays,
  HiCheckCircle,
  HiPlus,
  HiTrash,
  HiUserGroup,
} from "react-icons/hi2";
import { CalendlyScheduleEmbed } from "@/components/website/talk-to-expert/calendly-schedule-embed";
import { ApiError } from "@/lib/api";
import { fetchMyPgExperts, updateMyPgExperts } from "@/lib/payment";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

function newExpert() {
  return {
    id: `expert-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: "",
    designation: "",
    email: "",
    mobile: "",
    description: "",
    calendlyUrl: "",
    availabilitySlots: "",
    calendarSynced: false,
    status: "active",
    isPrimary: false,
  };
}

export function PgExpertManagement() {
  const [experts, setExperts] = useState([]);
  const [previewId, setPreviewId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [highlightedId, setHighlightedId] = useState("");
  const [removingId, setRemovingId] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMyPgExperts();
      setExperts(data.experts || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load internal experts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const previewExpert = useMemo(
    () => experts.find((expert) => expert.id === previewId) || null,
    [experts, previewId],
  );

  function updateExpert(id, key, value) {
    setExperts((current) =>
      current.map((expert) =>
        expert.id === id
          ? {
              ...expert,
              [key]: value,
              ...(key === "calendlyUrl" ? { calendarSynced: Boolean(value.trim()) } : {}),
            }
          : expert,
      ),
    );
  }

  function markPrimary(id) {
    setExperts((current) =>
      current.map((expert) => ({
        ...expert,
        isPrimary: expert.id === id,
        status: expert.id === id ? "active" : expert.status,
      })),
    );
  }

  function addExpert() {
    const expert = newExpert();
    setExperts((current) => {
      if (!current.some((item) => item.status === "active")) expert.isPrimary = true;
      return [...current, expert];
    });
    setHighlightedId(expert.id);
    setMessage("New expert form added. Complete the details and save.");
    window.setTimeout(
      () => setHighlightedId((current) => (current === expert.id ? "" : current)),
      900,
    );
  }

  function removeExpert(id, name) {
    if (!window.confirm(`Remove ${name || "this expert"}? Save changes to confirm removal.`)) {
      return;
    }

    setRemovingId(id);
    window.setTimeout(() => {
      setExperts((current) => {
        const remaining = current.filter((expert) => expert.id !== id);
        if (current.find((expert) => expert.id === id)?.isPrimary) {
          const firstActive = remaining.find((expert) => expert.status === "active");
          return remaining.map((expert) => ({
            ...expert,
            isPrimary: expert.id === firstActive?.id,
          }));
        }
        return remaining;
      });
      if (previewId === id) setPreviewId("");
      setRemovingId("");
      setMessage("Expert removed from the draft. Click Save expert routing to apply.");
    }, 250);
  }

  async function save() {
    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      const data = await updateMyPgExperts(experts);
      setExperts(data.experts || []);
      setMessage(data.message || "Expert routing settings saved");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save internal experts");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
        Loading expert routing settings…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
            Alias / Expert Routing Management
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            FR-PG-06 / FR-PG-07 · Assign internal advisors for merchant consultations and
            configure each advisor&apos;s Calendly schedule and published availability.
          </p>
        </div>
        <button
          type="button"
          onClick={addExpert}
          className="inline-flex items-center gap-2 rounded-full bg-[#2D4CC8] px-4 py-2.5 text-sm font-semibold text-white"
          style={{ color: "#fff" }}
        >
          <HiPlus className="size-4" /> Add expert
        </button>
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

      {experts.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <HiUserGroup className="mx-auto size-10 text-slate-400" />
          <h3 className="mt-3 font-bold text-[#13203F]">No internal experts assigned</h3>
          <p className="mt-1 text-sm text-slate-500">
            Add an advisor and connect their Calendly scheduling link.
          </p>
        </section>
      ) : (
        <div className="space-y-4">
          {experts.map((expert, index) => (
            <section
              key={expert.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 ${
                removingId === expert.id
                  ? "-translate-y-1 scale-[0.98] border-red-200 opacity-0"
                  : highlightedId === expert.id
                    ? "border-[#40C3CF] ring-4 ring-[#40C3CF]/20"
                    : "border-slate-200"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#EEF2FC] text-[#2D4CC8]">
                    <HiUserGroup className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#13203F]">
                      {expert.name || `Internal expert ${index + 1}`}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {expert.isPrimary ? "Primary routing advisor" : "Additional advisor"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!expert.isPrimary && expert.status === "active" ? (
                    <button
                      type="button"
                      onClick={() => markPrimary(expert.id)}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                    >
                      Make primary
                    </button>
                  ) : null}
                  <select
                    value={expert.status}
                    onChange={(e) => updateExpert(expert.id, "status", e.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                    disabled={expert.isPrimary}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeExpert(expert.id, expert.name)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                  >
                    <HiTrash className="size-3.5" /> Remove
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-600">
                  Expert name *
                  <input
                    className={`${inputClass} mt-1`}
                    value={expert.name}
                    onChange={(e) => updateExpert(expert.id, "name", e.target.value)}
                  />
                </label>
                <label className="text-sm font-medium text-slate-600">
                  Designation
                  <input
                    className={`${inputClass} mt-1`}
                    value={expert.designation}
                    onChange={(e) => updateExpert(expert.id, "designation", e.target.value)}
                    placeholder="Payments Advisor"
                  />
                </label>
                <label className="text-sm font-medium text-slate-600">
                  Email *
                  <input
                    type="email"
                    className={`${inputClass} mt-1`}
                    value={expert.email}
                    onChange={(e) => updateExpert(expert.id, "email", e.target.value)}
                  />
                </label>
                <label className="text-sm font-medium text-slate-600">
                  Mobile *
                  <input
                    className={`${inputClass} mt-1`}
                    value={expert.mobile}
                    onChange={(e) => updateExpert(expert.id, "mobile", e.target.value)}
                  />
                </label>
                <label className="text-sm font-medium text-slate-600 sm:col-span-2">
                  Advisor description
                  <textarea
                    rows={3}
                    className={`${inputClass} mt-1 resize-y`}
                    value={expert.description}
                    onChange={(e) => updateExpert(expert.id, "description", e.target.value)}
                    placeholder="Specialization, merchant categories, and consultation scope."
                  />
                </label>
                <label className="text-sm font-medium text-slate-600 sm:col-span-2">
                  Calendly scheduling URL
                  <input
                    type="url"
                    className={`${inputClass} mt-1`}
                    value={expert.calendlyUrl}
                    onChange={(e) => updateExpert(expert.id, "calendlyUrl", e.target.value)}
                    placeholder="https://calendly.com/your-advisor/30min"
                  />
                </label>
                <label className="text-sm font-medium text-slate-600 sm:col-span-2">
                  Published availability
                  <textarea
                    rows={3}
                    className={`${inputClass} mt-1 resize-y`}
                    value={expert.availabilitySlots}
                    onChange={(e) =>
                      updateExpert(expert.id, "availabilitySlots", e.target.value)
                    }
                    placeholder="Mon 10:00 AM, Tue 2:00 PM, Wed 4:30 PM"
                  />
                  <span className="mt-1 block text-xs text-slate-500">
                    Separate slots with commas, semicolons, or new lines.
                  </span>
                </label>
              </div>

              {expert.calendlyUrl ? (
                <button
                  type="button"
                  onClick={() => setPreviewId(previewId === expert.id ? "" : expert.id)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#2D4CC8]/30 bg-[#EEF2FC] px-4 py-2 text-sm font-semibold text-[#2D4CC8]"
                >
                  <HiCalendarDays className="size-4" />
                  {previewId === expert.id ? "Hide Calendly preview" : "Preview Calendly"}
                </button>
              ) : null}
            </section>
          ))}
        </div>
      )}

      {previewExpert?.calendlyUrl ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#13203F]">
            <HiCheckCircle className="size-5 text-emerald-600" />
            Calendly preview · {previewExpert.name}
          </div>
          <CalendlyScheduleEmbed url={previewExpert.calendlyUrl} />
        </section>
      ) : null}

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="button"
          disabled={isSaving}
          onClick={save}
          className="rounded-full bg-[#2D4CC8] px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
          style={{ color: "#fff" }}
        >
          {isSaving ? "Saving…" : "Save expert routing"}
        </button>
      </div>
    </div>
  );
}
