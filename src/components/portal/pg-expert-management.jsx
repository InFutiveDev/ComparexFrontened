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
import {
  WEEKDAY_OPTIONS,
  ensureWeeklyAvailability,
  formatWeeklyAvailability,
  newWeeklyScheduleEntry,
  serializeWeeklyAvailability,
} from "@/lib/pg-expert-schedule";
import { fetchMyPgExperts, updateMyPgExperts } from "@/lib/payment";
import { sanitizePhoneInput } from "@/lib/validation";

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
    weeklyAvailability: [newWeeklyScheduleEntry()],
    availabilitySlots: "",
    calendarSynced: false,
    status: "active",
  };
}

function ExpertWeeklySchedule({ schedules, onChange }) {
  function updateSchedule(scheduleId, updater) {
    onChange(
      schedules.map((entry) => (entry.id === scheduleId ? updater(entry) : entry)),
    );
  }

  function toggleDay(scheduleId, day) {
    updateSchedule(scheduleId, (entry) => {
      const selected = entry.days.includes(day);
      const nextDays = selected
        ? entry.days.filter((item) => item !== day)
        : [...entry.days, day];
      return { ...entry, days: nextDays };
    });
  }

  function updateTime(scheduleId, timeIndex, value) {
    updateSchedule(scheduleId, (entry) => ({
      ...entry,
      times: entry.times.map((time, index) => (index === timeIndex ? value : time)),
    }));
  }

  function addTime(scheduleId) {
    updateSchedule(scheduleId, (entry) => ({
      ...entry,
      times: [...entry.times, ""],
    }));
  }

  function removeTime(scheduleId, timeIndex) {
    updateSchedule(scheduleId, (entry) => {
      const nextTimes = entry.times.filter((_, index) => index !== timeIndex);
      return { ...entry, times: nextTimes.length ? nextTimes : [""] };
    });
  }

  function addScheduleBlock() {
    onChange([...schedules, newWeeklyScheduleEntry()]);
  }

  function removeScheduleBlock(scheduleId) {
    if (schedules.length <= 1) {
      onChange([newWeeklyScheduleEntry()]);
      return;
    }
    onChange(schedules.filter((entry) => entry.id !== scheduleId));
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule, blockIndex) => (
        <div
          key={schedule.id}
          className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Availability block {blockIndex + 1}
            </p>
            <button
              type="button"
              onClick={() => removeScheduleBlock(schedule.id)}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Remove block
            </button>
          </div>

          <p className="mb-2 text-xs font-medium text-slate-600">Days</p>
          <div className="flex flex-wrap gap-2">
            {WEEKDAY_OPTIONS.map((day) => {
              const selected = schedule.days.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(schedule.id, day.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    selected
                      ? "border-[#2D4CC8] bg-[#EEF2FC] text-[#2D4CC8]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#2D4CC8]/40"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>

          <p className="mb-2 mt-4 text-xs font-medium text-slate-600">Times</p>
          <div className="space-y-2">
            {schedule.times.map((time, timeIndex) => (
              <div key={`${schedule.id}-time-${timeIndex}`} className="flex gap-2">
                <input
                  className={`${inputClass} flex-1`}
                  value={time}
                  onChange={(e) => updateTime(schedule.id, timeIndex, e.target.value)}
                  placeholder="e.g. 10:00 AM"
                />
                <button
                  type="button"
                  onClick={() => removeTime(schedule.id, timeIndex)}
                  className="shrink-0 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addTime(schedule.id)}
            className="mt-2 text-xs font-semibold text-[#2D4CC8] hover:underline"
          >
            + Add another time
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addScheduleBlock}
        className="inline-flex items-center gap-1 rounded-full border border-[#2D4CC8]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#2D4CC8]"
      >
        <HiPlus className="size-3.5" /> Add day/time block
      </button>
    </div>
  );
}

function prepareExpertsForForm(experts = []) {
  return experts.map((expert) => ({
    ...expert,
    weeklyAvailability: ensureWeeklyAvailability(expert),
  }));
}

function prepareExpertsForSave(experts = []) {
  return experts.map((expert) => {
    const weeklyAvailability = serializeWeeklyAvailability(expert.weeklyAvailability);
    const fromWeekly = formatWeeklyAvailability(weeklyAvailability);
    return {
      ...expert,
      weeklyAvailability,
      availabilitySlots: fromWeekly || expert.availabilitySlots || "",
    };
  });
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
      setExperts(prepareExpertsForForm(data.experts || []));
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

  const activeExpertCount = useMemo(
    () => experts.filter((expert) => expert.status === "active").length,
    [experts],
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

  function updateExpertSchedule(id, weeklyAvailability) {
    updateExpert(id, "weeklyAvailability", weeklyAvailability);
  }

  function addExpert() {
    const expert = newExpert();
    setExperts((current) => [...current, expert]);
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
      setExperts((current) => current.filter((expert) => expert.id !== id));
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
      const data = await updateMyPgExperts(prepareExpertsForSave(experts));
      setExperts(prepareExpertsForForm(data.experts || []));
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
            FR-PG-06 / FR-PG-07 · Add multiple internal advisors. All active experts with
            published availability are shown to merchants based on their schedule.
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

      <section className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span className="font-semibold text-[#13203F]">{activeExpertCount}</span> active expert
        {activeExpertCount === 1 ? "" : "s"} configured. Merchants and Sub Admins can choose from
        all advisors who have availability set.
      </section>

      {experts.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <HiUserGroup className="mx-auto size-10 text-slate-400" />
          <h3 className="mt-3 font-bold text-[#13203F]">No internal experts assigned</h3>
          <p className="mt-1 text-sm text-slate-500">
            Add an advisor, set weekly availability, and connect their Calendly link.
          </p>
        </section>
      ) : (
        <div className="space-y-4">
          {experts.map((expert, index) => {
            const previewText = formatWeeklyAvailability(
              serializeWeeklyAvailability(expert.weeklyAvailability),
            );

            return (
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
                        {expert.status === "active" ? "Visible when available" : "Hidden (inactive)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={expert.status}
                      onChange={(e) => updateExpert(expert.id, "status", e.target.value)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
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
                      inputMode="numeric"
                      maxLength={11}
                      className={`${inputClass} mt-1`}
                      value={expert.mobile}
                      onChange={(e) =>
                        updateExpert(expert.id, "mobile", sanitizePhoneInput(e.target.value))
                      }
                      placeholder="10–11 digits"
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
                  <div className="sm:col-span-2">
                    <p className="text-sm font-medium text-slate-600">Weekly availability *</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Select days (e.g. Monday, Tuesday, or All days) and add one or more times
                      for each block.
                    </p>
                    <div className="mt-3">
                      <ExpertWeeklySchedule
                        schedules={expert.weeklyAvailability}
                        onChange={(value) => updateExpertSchedule(expert.id, value)}
                      />
                    </div>
                    {previewText ? (
                      <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        Preview: {previewText}
                      </p>
                    ) : null}
                  </div>
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
            );
          })}
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
