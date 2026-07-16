"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HiArrowPath,
  HiCalendarDays,
  HiCheck,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from "react-icons/hi2";
import {
  CalendlyScheduleEmbed,
  getCalendlyUrl,
} from "@/components/website/talk-to-expert/calendly-schedule-embed";
import { ApiError } from "@/lib/api";
import {
  bookSubAdminTalkToExpert,
  fetchRoutableExperts,
  fetchSubAdminLeads,
} from "@/lib/sub-admin";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

function formatCalendlySlot(payload = {}) {
  const event = payload.event || {};
  const invitee = payload.invitee || {};
  const startTime = event.start_time || invitee.start_time || null;

  let slotDateLabel = null;
  let slotTime = null;

  if (startTime) {
    const date = new Date(startTime);
    if (!Number.isNaN(date.getTime())) {
      slotDateLabel = date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      slotTime = date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
  }

  return {
    slotId: event.uri || invitee.uri || `calendly-${Date.now()}`,
    slotDateLabel: slotDateLabel || "Scheduled via Calendly",
    slotTime: slotTime || "See Calendly confirmation",
    calendlyEventUri: event.uri || null,
    calendlyInviteeUri: invitee.uri || null,
    scheduledAt: startTime || null,
  };
}

function matchesExpertQuery(expert, query) {
  const haystack = [
    expert.name,
    expert.companyName,
    expert.rep?.name,
    expert.rep?.title,
    expert.rep?.email,
    expert.rep?.phone,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

/**
 * FR-SA-07 — Route leads to PG experts via Calendly
 * FR-SA-08 — Display available expert slots before routing
 */
export function ExpertRoutingSection({ fixedLeadId = null, fixedLead = null, onRouted }) {
  const [experts, setExperts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(fixedLeadId || "");
  const [selectedExpertId, setSelectedExpertId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRouting, setIsRouting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [expertQuery, setExpertQuery] = useState("");

  const filteredExperts = useMemo(() => {
    const query = expertQuery.trim().toLowerCase();
    if (!query) return experts;
    return experts.filter((expert) => matchesExpertQuery(expert, query));
  }, [experts, expertQuery]);

  const selectedExpert = useMemo(
    () => experts.find((item) => item.id === selectedExpertId) || null,
    [experts, selectedExpertId],
  );

  const selectedSlot = useMemo(
    () => selectedExpert?.availableSlots?.find((slot) => slot.id === selectedSlotId) || null,
    [selectedExpert, selectedSlotId],
  );

  const calendlyUrl = selectedExpert?.calendlyUrl || getCalendlyUrl() || "";

  const selectedLead = useMemo(() => {
    if (fixedLead) return fixedLead;
    return leads.find((item) => item.id === selectedLeadId) || null;
  }, [fixedLead, leads, selectedLeadId]);

  const calendlyPrefill = useMemo(
    () => ({
      name: selectedLead?.businessName || "",
      email: selectedLead?.email || "",
      customAnswers: {
        a1: selectedLead?.businessName || "",
        a2: selectedLead?.phone || "",
        a3: selectedExpert?.name || "",
      },
    }),
    [selectedLead, selectedExpert],
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [expertsRes, leadsRes] = await Promise.all([
        fetchRoutableExperts(),
        fixedLeadId
          ? Promise.resolve({ leads: [] })
          : fetchSubAdminLeads({ page: 1, limit: 100 }),
      ]);
      setExperts(expertsRes.experts || []);
      if (!fixedLeadId) {
        setLeads(
          (leadsRes.leads || []).filter(
            (lead) =>
              lead.leadStatus !== "rejected" && lead.leadStatus !== "expert_booked",
          ),
        );
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load expert routing data");
    } finally {
      setIsLoading(false);
    }
  }, [fixedLeadId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (fixedLeadId) setSelectedLeadId(fixedLeadId);
  }, [fixedLeadId]);

  useEffect(() => {
    setSelectedSlotId("");
  }, [selectedExpertId]);

  useEffect(() => {
    if (!selectedExpertId) return;
    const stillVisible = filteredExperts.some((expert) => expert.id === selectedExpertId);
    if (!stillVisible) {
      setSelectedExpertId("");
      setSelectedSlotId("");
    }
  }, [filteredExperts, selectedExpertId]);

  async function routeWithCalendly(payload) {
    if (!selectedLeadId || !selectedExpertId || isRouting) return;

    setIsRouting(true);
    setError("");
    setMessage("");

    const slot = formatCalendlySlot(payload);

    try {
      const data = await bookSubAdminTalkToExpert(selectedLeadId, {
        paymentGatewayId: selectedExpertId,
        paymentGatewayName: selectedExpert?.name,
        representativeName: selectedExpert?.rep?.name,
        representativeTitle: selectedExpert?.rep?.title,
        notes: notes || undefined,
        preferredDate: selectedSlot?.dateLabel || undefined,
        preferredTime: selectedSlot?.time || selectedSlot?.label || undefined,
        slotId: slot.slotId,
        slotDateLabel: slot.slotDateLabel,
        slotTime: slot.slotTime,
        scheduledAt: slot.scheduledAt,
        calendlyEventUri: slot.calendlyEventUri,
        calendlyInviteeUri: slot.calendlyInviteeUri,
        bookingSource: "calendly",
        timezone: "Asia/Kolkata",
      });
      setMessage(data.message || "Lead routed to PG expert via Calendly");
      onRouted?.(data);
      if (!fixedLeadId) {
        setSelectedLeadId("");
        setSelectedExpertId("");
        setSelectedSlotId("");
        setNotes("");
        setExpertQuery("");
        loadData();
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to route lead to expert");
    } finally {
      setIsRouting(false);
    }
  }

  const expertCountLabel = isLoading
    ? "Loading experts…"
    : expertQuery.trim()
      ? `${filteredExperts.length} of ${experts.length} expert${experts.length === 1 ? "" : "s"} match "${expertQuery.trim()}"`
      : `${experts.length} PG expert${experts.length === 1 ? "" : "s"} available`;

  return (
    <div className="space-y-5">
      {!fixedLeadId ? (
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
            Expert Routing via Calendly
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            FR-SA-07 · Route qualified leads to PG experts for scheduled calls. FR-SA-08 · Review
            available expert slots before confirming in Calendly.
          </p>
        </div>
      ) : null}

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

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {!fixedLeadId ? (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Select lead to route
              </label>
              <select
                className={inputClass}
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
              >
                <option value="">Choose lead…</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.businessName} · {lead.leadStatus}
                    {lead.email ? ` · ${lead.email}` : ""}
                  </option>
                ))}
              </select>
              {selectedLeadId ? (
                <p className="mt-2 text-xs text-slate-500">
                  Open lead detail:{" "}
                  <Link
                    href={`/sub-admin-dashboard/leads/${selectedLeadId}`}
                    className="font-semibold text-[#2D4CC8] underline"
                  >
                    View
                  </Link>
                </p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-[#2D4CC8]/15 bg-[#EEF2FC]/60 px-4 py-3 text-sm text-[#13203F]">
              Routing lead <strong>{selectedLead?.businessName || fixedLeadId}</strong>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Search PG experts
                </label>
                <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-[34px] size-4 text-slate-400" />
                <input
                  className={`${inputClass} pl-9 pr-9`}
                  value={expertQuery}
                  onChange={(e) => setExpertQuery(e.target.value)}
                  placeholder="Filter by PG name, expert, email, or phone"
                  aria-label="Search PG experts"
                />
                {expertQuery ? (
                  <button
                    type="button"
                    onClick={() => setExpertQuery("")}
                    className="absolute right-2 top-[30px] flex size-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Clear expert search"
                  >
                    <HiOutlineXMark className="size-4" />
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={loadData}
                className="inline-flex h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600"
              >
                <HiArrowPath className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            <p className="text-xs text-slate-500">{expertCountLabel}</p>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                PG expert
              </label>
              <select
                className={inputClass}
                value={
                  filteredExperts.some((expert) => expert.id === selectedExpertId)
                    ? selectedExpertId
                    : ""
                }
                onChange={(e) => setSelectedExpertId(e.target.value)}
                disabled={isLoading || filteredExperts.length === 0}
              >
                <option value="">
                  {filteredExperts.length === 0
                    ? expertQuery.trim()
                      ? "No experts match your search"
                      : "No PG experts available"
                    : "Choose expert…"}
                </option>
                {filteredExperts.map((expert) => (
                  <option key={expert.id} value={expert.id}>
                    {expert.name} · {expert.rep?.name || "Expert"}
                    {expert.calendlyUrl ? " · Calendly ready" : ""}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Search filters this list. Select one expert to view slots and route via Calendly.
              </p>
            </div>
          </div>

          {selectedExpert ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#2D4CC8]">
                Nominated PG expert
              </p>
              <p className="mt-1 text-base font-bold text-[#13203F]">{selectedExpert.rep?.name}</p>
              <p className="text-sm text-slate-600">
                {selectedExpert.rep?.title} · {selectedExpert.name}
              </p>
              {selectedExpert.rep?.bio ? (
                <p className="mt-2 text-sm text-slate-600">{selectedExpert.rep.bio}</p>
              ) : null}
              {selectedExpert.availabilitySlots ? (
                <p className="mt-2 text-xs text-slate-500">
                  Published availability: {selectedExpert.availabilitySlots}
                </p>
              ) : null}
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Routing notes
            </label>
            <textarea
              className={inputClass}
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional context for the PG expert"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#EEF2FC] text-[#2D4CC8]">
              <HiCalendarDays className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#13203F]">
                Available expert slots (FR-SA-08)
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Review published slots, then confirm the live Calendly time to complete routing.
              </p>
            </div>
          </div>

          {!selectedExpert ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Select a PG expert to view available slots.
            </p>
          ) : (
            <>
              {selectedExpert.availableSlots?.length > 0 ? (
                <div className="grid max-h-52 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                  {selectedExpert.availableSlots.map((slot) => {
                    const active = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                          active
                            ? "border-[#2D4CC8] bg-[#EEF2FC] text-[#2D4CC8] ring-2 ring-[#2D4CC8]/15"
                            : "border-slate-200 bg-white text-[#13203F] hover:border-[#2D4CC8]/40"
                        }`}
                      >
                        <span className="font-semibold">{slot.label}</span>
                        {active ? (
                          <span className="mt-1 flex items-center gap-1 text-xs">
                            <HiCheck className="size-3.5" /> Preferred before Calendly
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  This expert has no published availability text. Use Calendly below to see live
                  open slots.
                </p>
              )}

              {!selectedLeadId ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Select a lead before scheduling in Calendly.
                </p>
              ) : null}

              {selectedLeadId ? (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-[#13203F]">
                    Confirm slot in Calendly (FR-SA-07)
                  </h4>
                  {isRouting ? (
                    <div className="mb-3 rounded-xl border border-[#2D4CC8]/20 bg-[#EEF2FC] px-4 py-3 text-sm text-[#2D4CC8]">
                      Saving expert routing…
                    </div>
                  ) : null}
                  <CalendlyScheduleEmbed
                    url={calendlyUrl}
                    prefill={calendlyPrefill}
                    onEventScheduled={routeWithCalendly}
                  />
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
