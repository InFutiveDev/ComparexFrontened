"use client";

import Image from "next/image";
import { useState } from "react";
import {
  HiArrowRight,
  HiBuildingOffice2,
  HiClock,
  HiEnvelope,
  HiMapPin,
  HiPhone,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { sanitizePhoneInput, validateMobilePhone } from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20";

const selectClass =
  "w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20";

const labelClass = "mb-1.5 block text-left text-sm font-medium text-slate-700";

const contactDetails = [
  {
    label: "Email us",
    value: "hello@comparex.io",
    hint: "We reply within 24 hours",
    href: "mailto:hello@comparex.io",
    Icon: HiEnvelope,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
  },
  {
    label: "Call us",
    value: "+91 90000 00000",
    hint: "Mon–Fri, 9 AM – 6 PM IST",
    href: "tel:+919000000000",
    Icon: HiPhone,
    accent: "text-[#25A36F]",
    iconBg: "bg-[#ECFDF5]",
  },
  {
    label: "Whatsapp us",
    value: "Whatsapp us",
    hint: "We reply within 24 hours",
    href: "https://api.whatsapp.com/send?phone=+919000000000",
    Icon: FaWhatsapp,
    accent: "text-[#25A36F]",
    iconBg: "bg-[#ECFDF5]",
  },
  {
    label: "Visit us",
    value: "Bengaluru, India",
    hint: "CompareX HQ",
    Icon: HiMapPin,
    accent: "text-[#0891b2]",
    iconBg: "bg-[#ecfeff]",
  },
  
];

const subjectOptions = [
  "General enquiry",
  "Merchant support",
  "Partnership / Reseller",
  "Payment provider listing",
  "Technical issue",
  "Other",
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const phone = String(new FormData(form).get("phone") || "").trim();

    if (phone) {
      const phoneError = validateMobilePhone(phone);
      if (phoneError) {
        setError(phoneError);
        return;
      }
    }

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden bg-[#fafbf9] py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(45,76,200,0.05) 26px, rgba(45,76,200,0.05) 27px)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#2D4CC8]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#25A36F]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
              Get in Touch
            </span>
            <h2 className="mt-5 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl">
              Let&apos;s talk about your{" "}
              <em className="italic text-slate-800">payment goals</em>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              From custom setups to partnership enquiries — tell us what you need and our team will
              guide you with clear, unbiased advice.
            </p>

            <ul className="mt-8 space-y-3">
              {contactDetails.map(({ label, value, hint, href, Icon, accent, iconBg }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#2D4CC8]/25 hover:shadow-md"
                    >
                      <div
                        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                      >
                        <Icon className={`size-5 ${accent}`} aria-hidden />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {label}
                        </p>
                        <p className="mt-0.5 truncate text-base font-semibold text-slate-900 group-hover:text-[#2D4CC8]">
                          {value}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                      <div
                        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                      >
                        <Icon className={`size-5 ${accent}`} aria-hidden />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {label}
                        </p>
                        <p className="mt-0.5 text-base font-semibold text-slate-900">{value}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_28px_70px_-30px_rgba(45,76,200,0.35)]">
              <div className="h-1.5 bg-gradient-to-r from-[#2D4CC8] via-[#3B5BDB] to-[#25A36F]" />

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                      Send us a message
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 sm:text-base">
                      All fields marked with * are required.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1.5 text-xs font-semibold text-[#1a7a52]">
                    <span className="size-1.5 rounded-full bg-[#25A36F]" aria-hidden />
                    Secure & confidential
                  </span>
                </div>

                {isSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#ECFDF5]">
                      <svg
                        viewBox="0 0 24 24"
                        className="size-8 text-[#25A36F]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden
                      >
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h4 className="mt-5 text-xl font-semibold text-slate-900">Message sent!</h4>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600 sm:text-base">
                      Thanks for reaching out. Our team will get back to you within one business
                      day.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6 text-sm font-semibold text-[#2D4CC8] hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
                    {error ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    ) : null}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className={labelClass}>
                          Full name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          placeholder="John Doe"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className={labelClass}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          inputMode="numeric"
                          maxLength={11}
                          placeholder="10–11 digits (WhatsApp preferred)"
                          className={inputClass}
                          onChange={(event) => {
                            event.target.value = sanitizePhoneInput(event.target.value);
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className={labelClass}>
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          placeholder="you@company.com"
                          className={inputClass}
                        />
                      </div>

                      <div >
                        <label htmlFor="subject" className={labelClass}>
                          How can we help? *
                        </label>
                        <select id="subject" name="subject" required className={selectClass} defaultValue="">
                          <option value="" disabled>
                            Select a topic
                          </option>
                          {subjectOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      

                      <div className="sm:col-span-2">
                        <label htmlFor="message" className={labelClass}>
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          placeholder="Tell us about your business, payment needs, or question..."
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                    </div>

                    <label className="flex cursor-pointer items-start gap-3  bg-slate-50/80 ">
                      <input
                        type="checkbox"
                        required
                        className="mt-0.5 size-4 rounded border-slate-300 text-[#2D4CC8] focus:ring-[#2D4CC8]/30"
                      />
                      <span className="text-sm leading-relaxed text-slate-600">
                        I agree that CompareX may contact me about my enquiry. Your information is
                        kept private and never sold to third parties.
                      </span>
                    </label>

                    <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-slate-500 sm:max-w-xs sm:text-sm">
                        Prefer email? Write directly to{" "}
                        <a
                          href="mailto:hello@comparex.io"
                          className="font-medium text-[#2D4CC8] hover:underline"
                        >
                          hello@comparex.io
                        </a>
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative inline-flex h-12 w-full items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 text-sm font-medium text-white transition hover:bg-[#3B5BDB] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[200px]"
                      >
                        <span className="z-10 pr-2">
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </span>
                        <span className="absolute right-1 inline-flex h-10 w-10 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
                          <span className="mr-3 flex items-center justify-center">
                            <HiArrowRight className="size-5 text-white" aria-hidden />
                          </span>
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
