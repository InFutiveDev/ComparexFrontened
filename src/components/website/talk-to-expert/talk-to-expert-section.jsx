"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiCalendarDays,
  HiCheck,
  HiOutlineChevronDown,
  HiOutlineXMark,
  HiUserGroup,
  HiBuildingOffice2,
} from "react-icons/hi2";
import { heroFormStepOneFields } from "@/lib/mock-data";
import {
  buildTimeSlots,
  businessPriorityOptions,
  getExpertById,
  getPgById,
  moreExperts,
  morePgs,
  prominentExperts,
  prominentPgs,
} from "./talk-to-expert-data";

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
        className="absolute inset-0 bg-[#13203F]/50 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="talk-expert-modal-title"
        className="relative flex max-h-[min(92vh,820px)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-[#eef2fa] shadow-2xl shadow-[#13203F]/20"
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
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">{children}</div>
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

function FormSelect({ id, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 text-left text-sm outline-none transition ${
          open
            ? "border-[#2D4CC8] ring-2 ring-[#2D4CC8]/15"
            : "border-slate-200 hover:border-[#2D4CC8]/30"
        } ${value ? "text-[#13203F]" : "text-slate-400"}`}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <HiOutlineChevronDown
          className={`size-4 shrink-0 text-[#2D4CC8] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <ul className="absolute z-50 mt-2 max-h-52 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer px-4 py-2.5 text-left text-sm transition ${
                  value === option.value
                    ? "bg-[#EEF2FC] font-semibold text-[#2D4CC8]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
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

function TalkToExpertModal({ open, onClose }) {
  const [flow, setFlow] = useState("type");
  const [consultType, setConsultType] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [visitorStep, setVisitorStep] = useState(1);
  const [visitor, setVisitor] = useState(initialVisitor);
  const [selectedSlot, setSelectedSlot] = useState("");
  const slots = useMemo(() => buildTimeSlots(), []);

  const selectedPg = consultType === "tpr" ? getPgById(selectedTargetId) : null;
  const selectedExpert = consultType === "tir" ? getExpertById(selectedTargetId) : null;

  function resetModal() {
    setFlow("type");
    setConsultType("");
    setSelectedTargetId("");
    setVisitorStep(1);
    setVisitor(initialVisitor);
    setSelectedSlot("");
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
    if (flow === "select") {
      return consultType === "tpr" ? "Select Payment Gateway" : "Select Industry Expert";
    }
    return "Talk to an Expert";
  }, [flow, consultType]);

  const progress = useMemo(() => {
    const map = { type: 1, select: 2, details: 3, schedule: 6, success: 6 };
    if (flow === "details") return { step: 2 + visitorStep, total: 6 };
    return { step: map[flow] ?? 1, total: 6 };
  }, [flow, visitorStep]);

  function canContinueDetails() {
    if (visitorStep === 1) {
      return Boolean(
        visitor.fullName.trim() &&
          visitor.phone.trim() &&
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

      {flow === "type" ? (
        <div className="space-y-5">
          <p className="text-sm text-slate-600">
            Choose how you&apos;d like to get expert guidance. Both options include scheduling a call
            at a time that works for you.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setConsultType("tpr");
                setFlow("select");
              }}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#2D4CC8]/40 hover:shadow-md"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#EEF2FC] text-[#2D4CC8]">
                <HiBuildingOffice2 className="size-6" aria-hidden />
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#2D4CC8]">TPR</p>
              <h3 className="mt-1 text-lg font-bold text-[#13203F]">Talk to PG Representatives</h3>
              <p className="mt-2 text-sm text-slate-600">
                Speak directly with nominated payment gateway representatives for onboarding and
                pricing guidance.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2D4CC8]">
                <HiCalendarDays className="size-4" aria-hidden />
                Schedule a call
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setConsultType("tir");
                setFlow("select");
              }}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#2D4CC8]/40 hover:shadow-md"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#EEF2FC] text-[#2D4CC8]">
                <HiUserGroup className="size-6" aria-hidden />
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#2D4CC8]">TIR</p>
              <h3 className="mt-1 text-lg font-bold text-[#13203F]">Talk to Industry Expert</h3>
              <p className="mt-2 text-sm text-slate-600">
                Get unbiased advice from CompareX-verified experts who help you choose the right
                platform.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2D4CC8]">
                <HiCalendarDays className="size-4" aria-hidden />
                Schedule a call
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {flow === "select" && consultType === "tpr" ? (
        <div className="space-y-5">
          <p className="text-sm text-slate-600">Select a payment gateway to connect with their nominated representative.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {prominentPgs.map((pg) => (
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
          <div>
            <label htmlFor="more-pg" className={labelClass}>
              More payment gateways
            </label>
            <FormSelect
              id="more-pg"
              value={selectedTargetId}
              onChange={setSelectedTargetId}
              placeholder="Select from more PGs"
              options={morePgs.map((pg) => ({ value: pg.id, label: pg.name }))}
            />
          </div>
        </div>
      ) : null}

      {flow === "select" && consultType === "tir" ? (
        <div className="space-y-5">
          <p className="text-sm text-slate-600">Choose an industry expert for unbiased platform guidance.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {prominentExperts.map((expert) => (
              <button
                key={expert.id}
                type="button"
                onClick={() => setSelectedTargetId(expert.id)}
                className={`cursor-pointer rounded-2xl border bg-white p-4 text-left transition ${
                  selectedTargetId === expert.id
                    ? "border-[#2D4CC8] bg-[#EEF2FC] ring-2 ring-[#2D4CC8]/20"
                    : "border-slate-200 hover:border-[#2D4CC8]/30"
                }`}
              >
                <p className="font-bold text-[#13203F]">{expert.name}</p>
                <p className="text-sm text-[#2D4CC8]">{expert.title}</p>
                <p className="mt-2 text-xs text-slate-500">{expert.focus}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {expert.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div>
            <label htmlFor="more-expert" className={labelClass}>
              More industry experts
            </label>
            <FormSelect
              id="more-expert"
              value={selectedTargetId}
              onChange={setSelectedTargetId}
              placeholder="Select another expert"
              options={moreExperts.map((expert) => ({
                value: expert.id,
                label: `${expert.name} — ${expert.title}`,
              }))}
            />
          </div>
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
                  <input id="visitor-phone" value={visitor.phone} onChange={(e) => updateVisitor("phone", e.target.value)} className={inputClass} />
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
          {consultType === "tpr" && selectedPg ? (
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

          {consultType === "tir" && selectedExpert ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#2D4CC8]">Industry Expert Profile</p>
              <h3 className="mt-1 text-lg font-bold text-[#13203F]">{selectedExpert.name}</h3>
              <p className="text-sm text-[#2D4CC8]">{selectedExpert.title}</p>
              <p className="mt-1 text-xs text-slate-500">{selectedExpert.experience} · {selectedExpert.focus}</p>
              <p className="mt-3 text-sm text-slate-600">{selectedExpert.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(selectedExpert.tags ?? []).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#EEF2FC] px-2.5 py-1 text-xs font-semibold text-[#2D4CC8]">
                    {tag}
                  </span>
                ))}
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
            <span className="font-semibold text-[#13203F]">{visitor.email}</span> and the{" "}
            {consultType === "tpr" ? "PG representative" : "industry expert"}.
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
              if (flow === "type") {
                handleClose();
                return;
              }
              if (flow === "select") {
                setFlow("type");
                setSelectedTargetId("");
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
      <section className="bg-[#f2f6fb] py-16 sm:py-20">
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
      </section>

      <TalkToExpertModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
