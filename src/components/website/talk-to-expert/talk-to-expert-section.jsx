"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiArrowLeft,
  HiArrowRight,
  HiCalendarDays,
  HiCheck,
  HiOutlineChevronDown,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from "react-icons/hi2";
import { heroFormStepOneFields } from "@/lib/mock-data";
import {
  buildTimeSlots,
  businessPriorityOptions,
  getPgById,
  morePgs,
  prominentPgs,
} from "./talk-to-expert-data";

const allPgs = [...prominentPgs, ...morePgs];

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
        className="relative flex max-h-[min(92vh,820px)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-[#eef2fa] shadow-2xl shadow-[#13203F]/20"
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

function sanitizePhoneDigits(value) {
  return value.replace(/\D/g, "").slice(0, 10);
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
  const [menuPosition, setMenuPosition] = useState(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selectableOptions = useMemo(
    () => options.filter((option) => option.value),
    [options]
  );

  const selected = selectableOptions.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return selectableOptions;

    return selectableOptions.filter((option) =>
      option.label.toLowerCase().includes(normalized)
    );
  }, [selectableOptions, query]);

  function updateMenuPosition() {
    const input = inputRef.current;
    if (!input) return;

    const rect = input.getBoundingClientRect();
    const menuMaxHeight = 220;
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUpward = spaceBelow < menuMaxHeight && spaceAbove > spaceBelow;

    setMenuPosition({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(menuMaxHeight, openUpward ? spaceAbove : spaceBelow),
      top: openUpward ? undefined : rect.bottom + gap,
      bottom: openUpward ? window.innerHeight - rect.top + gap : undefined,
    });
  }

  function openDropdown() {
    setOpen(true);
    updateMenuPosition();
  }

  function closeDropdown() {
    setOpen(false);
    setQuery(selected?.label ?? "");
  }

  useEffect(() => {
    if (!open) {
      setQuery(selected?.label ?? "");
    }
  }, [selected?.label, open]);

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    function handleClickOutside(event) {
      if (
        containerRef.current?.contains(event.target) ||
        event.target.closest?.("[data-form-select-menu]")
      ) {
        return;
      }
      closeDropdown();
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, selected?.label]);

  function handleSelect(optionValue, optionLabel) {
    onChange(optionValue);
    setQuery(optionLabel);
    onQueryChange?.(optionLabel);
    setOpen(false);
  }

  function handleInputChange(event) {
    setQuery(event.target.value);
    onQueryChange?.(event.target.value);
    if (!open) setOpen(true);
    if (value) onChange("");
  }

  function handleClear() {
    setQuery("");
    onQueryChange?.("");
    onChange("");
    inputRef.current?.focus();
    openDropdown();
  }

  const menu =
    open && menuPosition && typeof document !== "undefined"
      ? createPortal(
          <ul
            data-form-select-menu
            role="listbox"
            aria-labelledby={id}
            style={{
              position: "fixed",
              left: menuPosition.left,
              width: menuPosition.width,
              maxHeight: menuPosition.maxHeight,
              top: menuPosition.top,
              bottom: menuPosition.bottom,
              zIndex: 200,
            }}
            className="overflow-y-auto rounded-xl border border-[#2D4CC8]/25 bg-white py-1 shadow-2xl shadow-slate-900/15 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value === option.value;
                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(option.value, option.label)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition ${
                        isSelected
                          ? "bg-[#EEF2FC] font-semibold text-[#2D4CC8]"
                          : "text-slate-700 hover:bg-slate-50 hover:text-[#2D4CC8]"
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected ? <HiCheck className="size-4 shrink-0" aria-hidden /> : null}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-3 text-sm text-slate-500">No matches found</li>
            )}
          </ul>,
          document.body
        )
      : null;

  return (
    <div ref={containerRef} className="relative z-10">
      <HiOutlineMagnifyingGlass
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#2D4CC8]"
        aria-hidden
      />
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={openDropdown}
        onClick={openDropdown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-autocomplete="list"
        className={`w-full border bg-white py-3 pl-10 pr-10 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-[#2D4CC8]/20 ${
          inputClassName || "rounded-xl border-slate-200 focus:border-[#2D4CC8]"
        } ${open ? "border-[#2D4CC8] ring-2 ring-[#2D4CC8]/15" : ""}`}
      />
      {query ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Clear search"
        >
          <HiOutlineXMark className="size-4" />
        </button>
      ) : (
        <HiOutlineChevronDown
          className={`pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#2D4CC8] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      )}
      {menu}
    </div>
  );
}

function OptionButtons({ value, options, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
              selected
                ? "border-[#2D4CC8] bg-[#EEF2FC] text-[#13203F] ring-2 ring-[#2D4CC8]/20"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#2D4CC8]/40"
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
  const [visitorStep, setVisitorStep] = useState(1);
  const [visitor, setVisitor] = useState(initialVisitor);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [providerSearch, setProviderSearch] = useState("");
  const slots = useMemo(() => buildTimeSlots(), []);

  const selectedPg = getPgById(selectedTargetId);

  function resetModal() {
    setFlow("select");
    setSelectedTargetId("");
    setVisitorStep(1);
    setVisitor(initialVisitor);
    setSelectedSlot("");
    setProviderSearch("");
  }

  function handleClose() {
    resetModal();
    onClose();
  }

  function updateVisitor(key, value) {
    setVisitor((prev) => ({ ...prev, [key]: value }));
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
          /^\d{10}$/.test(visitor.phone) &&
          visitor.email.trim() &&
          visitor.company.trim()
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
          <p className="text-sm text-slate-600">Select a payment gateway to connect with their nominated representative.</p>

          <SearchableSelect
            id="pg-search"
            value={selectedTargetId}
            onChange={setSelectedTargetId}
            onQueryChange={setProviderSearch}
            placeholder="Search payment gateways..."
            inputClassName="rounded-full border-[#2D4CC8] focus:border-[#2D4CC8]"
            options={allPgs.map((pg) => ({ value: pg.id, label: pg.name }))}
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {prominentPgs
              .filter((pg) => matchesSearchText(pg.name, providerSearch))
              .map((pg) => (
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
                <ProviderLogo name={pg.name} logo={pg.logo} />
                <span className="text-center text-sm font-semibold text-[#13203F]">{pg.name}</span>
              </button>
            ))}
          </div>

          {prominentPgs.filter((pg) => matchesSearchText(pg.name, providerSearch)).length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
              No popular gateways match your search.
            </p>
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
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="10-digit (WhatsApp preferred)"
                    value={visitor.phone}
                    onChange={(e) => updateVisitor("phone", sanitizePhoneDigits(e.target.value))}
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
                  <h3 className="text-lg font-bold text-[#13203F]">{selectedPg.rep.name}</h3>
                  <p className="text-sm text-slate-600">{selectedPg.rep.title} · {selectedPg.name}</p>
                  <p className="mt-2 text-sm text-slate-600">{selectedPg.rep.bio}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#13203F]">Available slots (Calendly sync — demo)</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`cursor-pointer rounded-xl border px-3 py-3 text-left text-sm transition ${
                    selectedSlot === slot.id
                      ? "border-[#2D4CC8] bg-[#EEF2FC] ring-2 ring-[#2D4CC8]/20"
                      : "border-slate-200 bg-white hover:border-[#2D4CC8]/30"
                  }`}
                >
                  <p className="font-semibold text-[#13203F]">{slot.dateLabel}</p>
                  <p className="text-xs text-slate-500">{slot.time}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {flow === "success" ? (
        <div className="py-4 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#25a36f] text-white shadow-lg shadow-[#25a36f]/30">
            <HiCheck className="size-8" aria-hidden />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-[#13203F]">Booking Confirmed 🎉</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
            Your call has been scheduled. A confirmation email has been sent to{" "}
            <span className="font-semibold text-[#13203F]">{visitor.email}</span> and the PG representative.
          </p>
          <p className="mt-2 text-xs text-slate-500">Demo mode — Calendly & email integration coming soon.</p>
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
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-5">
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

          <button
            type="button"
            disabled={
              (flow === "select" && !selectedTargetId) ||
              (flow === "details" && !canContinueDetails()) ||
              (flow === "schedule" && !selectedSlot)
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
                return;
              }
              if (flow === "schedule" && selectedSlot) {
                setFlow("success");
              }
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {flow === "schedule" ? "Confirm Booking" : "Next"}
            <HiArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </ModalShell>
  );
}

export default function TalkToExpertSection({ isOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <>
      {/* <section className="bg-[#f2f6fb] py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-[#13203F]/5 sm:p-12">
            <h2 className="text-2xl font-bold text-[#13203F] sm:text-3xl">
              Unbiased Expert Guidance for Your Payment Stack
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Talk to PG representatives or independent industry experts. Compare onboarding,
              pricing, and platform fit — then schedule a call in minutes.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#2D4CC8]/15 bg-[#EEF2FC]/50 p-5 text-left">
                <p className="text-xs font-bold uppercase tracking-wide text-[#2D4CC8]">TPR</p>
                <p className="mt-1 font-semibold text-[#13203F]">Talk to PG Representatives</p>
                <p className="mt-2 text-sm text-slate-600">Direct conversations with nominated PG sales & success teams.</p>
              </div>
              <div className="rounded-2xl border border-[#2D4CC8]/15 bg-[#EEF2FC]/50 p-5 text-left">
                <p className="text-xs font-bold uppercase tracking-wide text-[#2D4CC8]">TIR</p>
                <p className="mt-1 font-semibold text-[#13203F]">Talk to Industry Expert</p>
                <p className="mt-2 text-sm text-slate-600">Independent advisors who help you choose the right platform.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-8 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2D4CC8]/25 transition hover:brightness-110"
              style={{ color: "#fff" }}
            >
              <HiCalendarDays className="size-5" aria-hidden />
              Talk to Expert
            </button>
          </div>
        </div>
      </section> */}

      <TalkToExpertModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
