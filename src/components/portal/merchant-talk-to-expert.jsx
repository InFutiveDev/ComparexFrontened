"use client";

import { useState } from "react";
import {
  HiCalendarDays,
  HiCheckCircle,
  HiUserGroup,
} from "react-icons/hi2";
import TalkToExpertSection from "@/components/website/talk-to-expert/talk-to-expert-section";

export function MerchantTalkToExpert() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Talk to Expert
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          FR-MC-07 / FR-MC-08 · Select an available payment-gateway expert, then choose
          your consultation date and time through Calendly.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#13203F] to-[#2D4CC8] px-6 py-8 text-white sm:px-8">
          <HiUserGroup className="size-10 text-[#40C3CF]" />
          <h3 className="mt-4 text-2xl font-bold">Schedule a merchant consultation</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
            Choose a payment gateway and one of its active internal advisors. Calendly
            will show that expert&apos;s available dates and time slots.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#2D4CC8] shadow-lg"
          >
            <HiCalendarDays className="size-5" />
            Open Calendly scheduler
          </button>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          {[
            ["1", "Select PG", "Choose the payment gateway you want to consult."],
            ["2", "Select expert", "Pick an active advisor and review availability."],
            ["3", "Choose date & time", "Confirm an available slot directly in Calendly."],
          ].map(([step, title, description]) => (
            <div key={step} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#EEF2FC] text-xs font-bold text-[#2D4CC8]">
                  {step}
                </span>
                <HiCheckCircle className="size-4 text-emerald-500" />
              </div>
              <h4 className="mt-3 font-bold text-[#13203F]">{title}</h4>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <TalkToExpertSection isOpen={open} onOpenChange={setOpen} />
    </div>
  );
}
