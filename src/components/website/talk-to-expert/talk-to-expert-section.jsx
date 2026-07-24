"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiArrowLeft,
  HiArrowRight,
  HiCheck,
  HiOutlineChevronDown,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from "react-icons/hi2";
import { ApiError } from "@/lib/api";
import { submitExpertBooking } from "@/lib/expert";
import { heroFormStepOneFields } from "@/lib/mock-data";
import { fetchTalkToExpertProviders } from "@/lib/payment";
import { expertHasAvailability } from "@/lib/pg-expert-schedule";
import { isValidMobilePhone, sanitizePhoneInput } from "@/lib/validation";
import { businessPriorityOptions } from "./talk-to-expert-data";
import { CalendlyScheduleEmbed } from "./calendly-schedule-embed";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const labelClass = "mb-1.5 block text-left text-sm font-medium text-slate-600";

const initialVisitor = {
  fullName: "",
  website: "",
  phone: "",
  email: "",
  company: "",
  industry: "",
  priority: "",
};

function ModalShell({ open, onClose, children, title }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#13203F]/50"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="talk-expert-modal-title"
        className="relative flex max-h-[min(94vh,920px)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-[#eef2fa] shadow-2xl shadow-[#13203F]/20"
      >
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-5 py-4">
          <h2 id="talk-expert-modal-title" className="text-lg font-bold text-[#13203F] sm:text-xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#2D4CC8]/30 hover:text-[#13203F]"
            aria-label="Close"
          >
            <HiOutlineXMark className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-visible px-4 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        <span>
          Step {step} of {total}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[#2D4CC8]/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] transition-all duration-300"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function matchesSearchText(text, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return text.toLowerCase().includes(normalized);
}

function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Search...",
  onQueryChange,
  inputClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPos, setMenuPos] = useState(null);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const selected = options.find((opt) => opt.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query]);

  const updateMenuPos = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updateMenuPos();
    const onScroll = () => updateMenuPos();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, updateMenuPos]);

  useEffect(() => {
    function handlePointer(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          id={id}
          value={open ? query : selected?.label || query}
          placeholder={placeholder}
          onFocus={() => {
            setOpen(true);
            setQuery(selected?.label || "");
            updateMenuPos();
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            onQueryChange?.(e.target.value);
            setOpen(true);
          }}
          className={`${inputClass} pl-11 pr-10 ${inputClassName}`}
        />
        <HiOutlineChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
      {open && menuPos && typeof document !== "undefined"
        ? createPortal(
            <ul
              className="fixed z-[120] max-h-60 overflow-auto rounded-2xl border border-slate-200 bg-white py-2 shadow-xl"
              style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500">No matches</li>
              ) : (
                filtered.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 text-left text-sm text-[#13203F] hover:bg-[#EEF2FC]"
                      onClick={() => {
                        onChange(opt.value);
                        setQuery(opt.label);
                        onQueryChange?.(opt.label);
                        setOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))
              )}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}

function OptionButtons({ value, options, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition ${
              selected
                ? "border-[#2D4CC8] bg-[#EEF2FC] text-[#2D4CC8] ring-2 ring-[#2D4CC8]/15"
                : "border-slate-200 bg-white text-[#13203F] hover:border-[#2D4CC8]/30"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function ProviderLogo({ name, logo, initials }) {
  const isRemote = typeof logo === "string" && /^https?:\/\//i.test(logo);

  if (logo && isRemote) {
    return (
      <div className="flex size-14 items-center justify-center rounded-xl border border-slate-100 bg-white p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  if (logo) {
    return (
      <div className="flex size-14 items-center justify-center rounded-xl border border-slate-100 bg-white p-2">
        <Image src={logo} alt="" width={48} height={48} className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  return (
    <div className="flex size-14 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold text-[#2D4CC8]">
      {initials ?? name.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function TalkToExpertModal({ open, onClose }) {
  const [flow, setFlow] = useState("select");
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [selectedExpertId, setSelectedExpertId] = useState("");
  const [visitorStep, setVisitorStep] = useState(1);
  const [visitor, setVisitor] = useState(initialVisitor);
  const [providerSearch, setProviderSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [calendlyBooked, setCalendlyBooked] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [providersError, setProvidersError] = useState("");

  const selectedPg = useMemo(
    () => providers.find((pg) => pg.id === selectedTargetId) || null,
    [providers, selectedTargetId],
  );
  const availableExperts = useMemo(() => {
    if (!selectedPg) return [];
    if (Array.isArray(selectedPg.experts) && selectedPg.experts.length > 0) {
      return selectedPg.experts.filter(
        (expert) => expert.status !== "inactive" && expertHasAvailability(expert),
      );
    }
    return selectedPg.rep?.name && expertHasAvailability(selectedPg)
      ? [
          {
            id: selectedPg.expertId || "legacy",
            name: selectedPg.rep.name,
            designation: selectedPg.rep.title,
            description: selectedPg.rep.bio,
            calendlyUrl: selectedPg.calendlyUrl,
            availabilitySlots: selectedPg.availabilitySlots,
            weeklyAvailability: selectedPg.weeklyAvailability,
          },
        ]
      : [];
  }, [selectedPg]);
  const selectedExpert = useMemo(
    () =>
      availableExperts.find((expert) => expert.id === selectedExpertId) ||
      availableExperts[0] ||
      null,
    [availableExperts, selectedExpertId],
  );

  useEffect(() => {
    setSelectedExpertId(availableExperts[0]?.id || "");
  }, [selectedTargetId, availableExperts]);

  const visibleProviders = useMemo(
    () => providers.filter((pg) => matchesSearchText(pg.name, providerSearch)),
    [providers, providerSearch],
  );

  const loadProviders = useCallback(async () => {
    setProvidersLoading(true);
    setProvidersError("");
    try {
      const data = await fetchTalkToExpertProviders();
      setProviders(Array.isArray(data.paymentGateways) ? data.paymentGateways : []);
    } catch (err) {
      setProviders([]);
      setProvidersError(
        err instanceof ApiError ? err.message : "Failed to load payment gateway experts",
      );
    } finally {
      setProvidersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    loadProviders();
  }, [open, loadProviders]);

  const calendlyPrefill = useMemo(
    () => ({
      name: visitor.fullName.trim(),
      email: visitor.email.trim(),
      customAnswers: {
        a1: visitor.company.trim(),
        a2: visitor.phone.trim(),
        a3: selectedExpert
          ? `${selectedPg?.name || ""} · ${selectedExpert.name}`
          : selectedPg?.name || "",
      },
    }),
    [
      visitor.fullName,
      visitor.email,
      visitor.company,
      visitor.phone,
      selectedPg?.name,
      selectedExpert,
    ],
  );

  function resetModal() {
    setFlow("select");
    setSelectedTargetId("");
    setSelectedExpertId("");
    setVisitorStep(1);
    setVisitor(initialVisitor);
    setProviderSearch("");
    setIsSubmitting(false);
    setSubmitError("");
    setCalendlyBooked(false);
  }

  function handleClose() {
    resetModal();
    onClose();
  }

  function updateVisitor(key, value) {
    setVisitor((prev) => ({ ...prev, [key]: value }));
  }

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

  async function confirmBookingFromCalendly(payload) {
    if (!selectedPg || isSubmitting || calendlyBooked) return;

    setIsSubmitting(true);
    setSubmitError("");

    const slot = formatCalendlySlot(payload);

    try {
      await submitExpertBooking({
        fullName: visitor.fullName.trim(),
        businessName: visitor.company.trim(),
        email: visitor.email.trim(),
        phone: visitor.phone.trim(),
        website: visitor.website.trim(),
        industry: visitor.industry,
        priority: visitor.priority,
        paymentGatewayId: selectedPg.id,
        paymentGatewayName: selectedPg.name,
        expertId: selectedExpert?.id || selectedPg.expertId || null,
        representativeName: selectedExpert?.name || selectedPg.rep?.name || null,
        representativeTitle:
          selectedExpert?.designation || selectedPg.rep?.title || null,
        slotId: slot.slotId,
        slotDateLabel: slot.slotDateLabel,
        slotTime: slot.slotTime,
        calendlyEventUri: slot.calendlyEventUri,
        calendlyInviteeUri: slot.calendlyInviteeUri,
        scheduledAt: slot.scheduledAt,
        bookingSource: "calendly",
      });
      setCalendlyBooked(true);
      setFlow("success");
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to save your Calendly booking");
    } finally {
      setIsSubmitting(false);
    }
  }

  const modalTitle = useMemo(() => {
    if (flow === "success") return "Booking Confirmed";
    if (flow === "schedule") return "Schedule Your Call";
    if (flow === "details") return "Your Details";
    if (flow === "select") return "Select Payment Gateway";
    return "Talk to an Expert";
  }, [flow]);

  const progress = useMemo(() => {
    const map = { select: 1, details: 2, schedule: 5, success: 5 };
    if (flow === "details") return { step: 1 + visitorStep, total: 5 };
    return { step: map[flow] ?? 1, total: 5 };
  }, [flow, visitorStep]);

  function canContinueDetails() {
    if (visitorStep === 1) {
      return Boolean(
        visitor.fullName.trim() &&
          isValidMobilePhone(visitor.phone) &&
          visitor.email.trim() &&
          visitor.company.trim(),
      );
    }
    if (visitorStep === 2) return Boolean(visitor.industry);
    if (visitorStep === 3) return Boolean(visitor.priority);
    return false;
  }

  return (
    <ModalShell open={open} onClose={handleClose} title={modalTitle}>
      {flow !== "success" ? <ProgressBar step={progress.step} total={progress.total} /> : null}

      {flow === "select" ? (
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            Select a payment gateway to connect with their nominated representative.
          </p>

          <SearchableSelect
            id="pg-search"
            value={selectedTargetId}
            onChange={setSelectedTargetId}
            onQueryChange={setProviderSearch}
            placeholder="Search payment gateways..."
            inputClassName="rounded-full border-[#2D4CC8] focus:border-[#2D4CC8]"
            options={providers.map((pg) => ({ value: pg.id, label: pg.name }))}
          />

          {providersLoading ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
              Loading payment gateways…
            </p>
          ) : null}

          {providersError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {providersError}
              <button
                type="button"
                onClick={loadProviders}
                className="ml-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          ) : null}

          {!providersLoading && !providersError && visibleProviders.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
              {providers.length === 0
                ? "No payment gateways have nominated an expert yet."
                : "No payment gateways match your search."}
            </p>
          ) : null}

          {!providersLoading && visibleProviders.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {visibleProviders.map((pg) => (
                <button
                  key={pg.id}
                  type="button"
                  onClick={() => setSelectedTargetId(pg.id)}
                  className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border bg-white p-4 transition ${
                    selectedTargetId === pg.id
                      ? "border-[#2D4CC8] bg-[#EEF2FC] ring-2 ring-[#2D4CC8]/20"
                      : "border-slate-200 hover:border-[#2D4CC8]/30"
                  }`}
                >
                  <ProviderLogo name={pg.name} logo={pg.logo} initials={pg.initials} />
                  <span className="text-center text-sm font-semibold text-[#13203F]">{pg.name}</span>
                  {pg.rep?.name ? (
                    <span className="text-center text-[11px] text-slate-500">{pg.rep.name}</span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}

          {selectedPg && availableExperts.length > 0 ? (
            <div className="rounded-2xl border border-[#2D4CC8]/20 bg-[#EEF2FC] p-4">
              <label
                htmlFor="available-expert"
                className="text-sm font-semibold text-[#13203F]"
              >
                Select expert (by availability)
              </label>
              <select
                id="available-expert"
                value={selectedExpert?.id || ""}
                onChange={(event) => setSelectedExpertId(event.target.value)}
                className={`${inputClass} mt-2 bg-white`}
              >
                {availableExperts.map((expert) => (
                  <option key={expert.id} value={expert.id}>
                    {expert.name}
                    {expert.designation ? ` · ${expert.designation}` : ""}
                    {expert.calendlyUrl ? " · Calendly available" : ""}
                  </option>
                ))}
              </select>
              {selectedExpert?.availabilitySlots ? (
                <p className="mt-2 text-xs text-slate-600">
                  Published availability: {selectedExpert.availabilitySlots}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {flow === "details" ? (
        <div className="space-y-5">
          {visitorStep === 1 ? (
            <>
              <div>
                <h3 className="text-lg font-bold text-[#13203F]">Let&apos;s connect you with the right expert</h3>
                <p className="mt-1 text-sm text-slate-600">Please provide your details to get started.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="visitor-name" className={labelClass}>Full Name *</label>
                  <input id="visitor-name" value={visitor.fullName} onChange={(e) => updateVisitor("fullName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="visitor-company" className={labelClass}>Business Name *</label>
                  <input id="visitor-company" value={visitor.company} onChange={(e) => updateVisitor("company", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="visitor-website" className={labelClass}>Website</label>
                  <input id="visitor-website" value={visitor.website} onChange={(e) => updateVisitor("website", e.target.value)} placeholder="https://" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="visitor-phone" className={labelClass}>Mobile *</label>
                  <input
                    id="visitor-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={11}
                    placeholder="10–11 digits (WhatsApp preferred)"
                    value={visitor.phone}
                    onChange={(e) => updateVisitor("phone", sanitizePhoneInput(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="visitor-email" className={labelClass}>Email *</label>
                  <input id="visitor-email" type="email" value={visitor.email} onChange={(e) => updateVisitor("email", e.target.value)} className={inputClass} />
                </div>
              </div>
            </>
          ) : null}

          {visitorStep === 2 ? (
            <>
              <div>
                <h3 className="text-lg font-bold text-[#13203F]">What kind of business are you running?</h3>
                <p className="mt-1 text-sm text-slate-600">We&apos;ll tailor expert recommendations to your business model.</p>
              </div>
              <OptionButtons
                value={visitor.industry}
                options={heroFormStepOneFields[0].options}
                onChange={(value) => updateVisitor("industry", value)}
              />
            </>
          ) : null}

          {visitorStep === 3 ? (
            <>
              <div>
                <h3 className="text-lg font-bold text-[#13203F]">What matters most to your business right now?</h3>
                <p className="mt-1 text-sm text-slate-600">Choose the key factor influencing your decision.</p>
              </div>
              <OptionButtons
                value={visitor.priority}
                options={businessPriorityOptions}
                onChange={(value) => updateVisitor("priority", value)}
              />
            </>
          ) : null}
        </div>
      ) : null}

      {flow === "schedule" ? (
        <div className="space-y-5">
          {selectedPg ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <ProviderLogo name={selectedPg.name} logo={selectedPg.logo} initials={selectedPg.initials} />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#2D4CC8]">Nominated PG Rep</p>
                  <h3 className="text-lg font-bold text-[#13203F]">
                    {selectedExpert?.name || selectedPg.rep?.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {selectedExpert?.designation || selectedPg.rep?.title} ·{" "}
                    {selectedPg.name}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {selectedExpert?.description || selectedPg.rep?.bio}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#13203F]">Pick a time with Calendly</h3>
            <p className="mb-3 text-sm text-slate-600">
              Choose a slot below. Your booking is confirmed automatically once you schedule.
            </p>
            {isSubmitting ? (
              <div className="mb-3 rounded-xl border border-[#2D4CC8]/20 bg-[#EEF2FC] px-4 py-3 text-sm text-[#2D4CC8]">
                Saving your booking…
              </div>
            ) : null}
            <CalendlyScheduleEmbed
              url={
                selectedExpert?.calendlyUrl ||
                selectedPg?.calendlyUrl ||
                undefined
              }
              prefill={calendlyPrefill}
              onEventScheduled={confirmBookingFromCalendly}
            />
          </div>
        </div>
      ) : null}

      {flow === "success" ? (
        <div className="py-4 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#25a36f] text-white shadow-lg shadow-[#25a36f]/30">
            <HiCheck className="size-8" aria-hidden />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-[#13203F]">Booking Confirmed</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
            Your Calendly call is booked. A confirmation email will go to{" "}
            <span className="font-semibold text-[#13203F]">{visitor.email}</span>. Our team and the
            PG representative will follow up shortly.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-8 py-3 text-sm font-semibold text-white shadow-lg"
            style={{ color: "#fff" }}
          >
            Done
          </button>
        </div>
      ) : null}

      {flow !== "success" ? (
        <div className="mt-6 space-y-3 border-t border-slate-200/70 pt-5">
          {submitError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (flow === "select") {
                handleClose();
                return;
              }
              if (flow === "details") {
                if (visitorStep > 1) {
                  setVisitorStep((s) => s - 1);
                } else {
                  setFlow("select");
                }
                return;
              }
              if (flow === "schedule") {
                setFlow("details");
                setVisitorStep(3);
              }
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#2D4CC8]/40"
          >
            <HiArrowLeft className="size-4" aria-hidden />
            Back
          </button>

          {flow !== "schedule" ? (
            <button
              type="button"
              disabled={
                isSubmitting ||
                providersLoading ||
                (flow === "select" && (!selectedTargetId || !selectedExpert)) ||
                (flow === "details" && !canContinueDetails())
              }
              onClick={() => {
                if (flow === "select" && selectedTargetId) {
                  setVisitorStep(1);
                  setFlow("details");
                  return;
                }
                if (flow === "details") {
                  if (visitorStep < 3) {
                    setVisitorStep((s) => s + 1);
                    return;
                  }
                  setFlow("schedule");
                }
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              style={{ color: "#fff" }}
            >
              Next
              <HiArrowRight className="size-4" aria-hidden />
            </button>
          ) : (
            <p className="text-right text-xs text-slate-500 sm:text-sm">
              Schedule in Calendly to finish
            </p>
          )}
          </div>
        </div>
      ) : null}
    </ModalShell>
  );
}

export default function TalkToExpertSection({ isOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return <TalkToExpertModal open={open} onClose={() => setOpen(false)} />;
}
