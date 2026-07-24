"use client";

import { useState } from "react";
import {
  HiArrowRight,
  HiBriefcase,
  HiCheck,
  HiGlobeAlt,
  HiLightBulb,
  HiRocketLaunch,
  HiUserGroup,
} from "react-icons/hi2";
import { sanitizePhoneInput, validateMobilePhone } from "@/lib/validation";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20";

const selectClass =
  "w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20";

const labelClass = "mb-1.5 block text-left text-sm font-medium text-slate-700";

const perks = [
  {
    title: "Meaningful impact",
    description: "Help thousands of businesses make smarter payment decisions every day.",
    Icon: HiRocketLaunch,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
  },
  {
    title: "Fast-growing fintech",
    description: "Join a team shaping how India compares and chooses payment gateways.",
    Icon: HiLightBulb,
    accent: "text-[#25A36F]",
    iconBg: "bg-[#ECFDF5]",
  },
  {
    title: "Collaborative culture",
    description: "Work with curious minds across product, sales, and payment expertise.",
    Icon: HiUserGroup,
    accent: "text-[#0891b2]",
    iconBg: "bg-[#ecfeff]",
  },
  {
    title: "Remote-friendly",
    description: "Flexible work options with a team rooted in Bengaluru, India.",
    Icon: HiGlobeAlt,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
  },
];

const openRoles = [
  {
    title: "Payment Solutions Expert",
    type: "Full-time · Bengaluru / Remote",
    department: "Operations",
  },
  {
    title: "Business Development Manager",
    type: "Full-time · Bengaluru",
    department: "Sales",
  },
  {
    title: "Software Engineer",
    type: "Full-time · Bengaluru / Remote",
    department: "Engineering",
  },
  {
    title: "Customer Success Associate",
    type: "Full-time · Bengaluru",
    department: "Support",
  },
];

const positionOptions = [
  "Payment Solutions Expert",
  "Business Development Manager",
  "Software Engineer",
  "Customer Success Associate",
  "Product Manager",
  "Marketing Specialist",
  "General Application",
];

export default function CareersSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const phone = String(new FormData(form).get("phone") || "").trim();
    const phoneError = validateMobilePhone(phone);

    if (phoneError) {
      setError(phoneError);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  }

  function handleApply(role) {
    setSelectedRole(role);
    document.getElementById("careers-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(45,76,200,0.05) 26px, rgba(45,76,200,0.05) 27px)",
        }}
      />

      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
            Why CompareX
          </span>
          <h2 className="mt-5 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl">
            Grow your career where{" "}
            <em className="italic text-slate-800">payments matter</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            We&apos;re building India&apos;s most trusted platform for payment gateway comparison —
            and we&apos;re looking for people who care about clarity, trust, and real outcomes.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(({ title, description, Icon, accent, iconBg }) => (
            <li
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`flex size-11 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className={`size-5 ${accent}`} aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </li>
          ))}
        </ul>

       

        <div
          id="careers-form"
          className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14"
        >
          <div className="lg:col-span-5">
            <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
              Apply Now
            </span>
            <h3 className="mt-5 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl">
              Send us your{" "}
              <em className="italic text-slate-800">application</em>
            </h3>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Share your details and resume. Our hiring team reviews every application and will reach
              out if there&apos;s a strong fit.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Response within 5 business days",
                "Transparent hiring process",
                "Equal opportunity employer",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-600 sm:text-base">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#25A36F]">
                    <HiCheck className="size-3.5 text-white" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-6">
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                    Application form
                  </h4>
                  <p className="mt-1.5 text-sm text-slate-600 sm:text-base">
                    Fields marked with * are required.
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
                    <HiCheck className="size-8 text-[#25A36F]" aria-hidden />
                  </div>
                  <h4 className="mt-5 text-xl font-semibold text-slate-900">
                    Application submitted!
                  </h4>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600 sm:text-base">
                    Thank you for your interest in CompareX. Our team will review your application
                    and get back to you soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setSelectedRole("");
                    }}
                    className="mt-6 text-sm font-semibold text-[#2D4CC8] hover:underline"
                  >
                    Submit another application
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
                      <label htmlFor="career-name" className={labelClass}>
                        Full name *
                      </label>
                      <input
                        type="text"
                        id="career-name"
                        name="name"
                        required
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="career-email" className={labelClass}>
                        Email *
                      </label>
                      <input
                        type="email"
                        id="career-email"
                        name="email"
                        required
                        placeholder="you@email.com"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="career-phone" className={labelClass}>
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="career-phone"
                        name="phone"
                        required
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
                      <label htmlFor="career-position" className={labelClass}>
                        Position applying for *
                      </label>
                      <select
                        id="career-position"
                        name="position"
                        required
                        className={selectClass}
                        value={selectedRole}
                        onChange={(event) => setSelectedRole(event.target.value)}
                      >
                        <option value="" disabled>
                          Select a role
                        </option>
                        {positionOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="career-experience" className={labelClass}>
                        Years of experience
                      </label>
                      <select
                        id="career-experience"
                        name="experience"
                        className={selectClass}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select experience
                        </option>
                        <option value="0-1">0–1 years</option>
                        <option value="1-3">1–3 years</option>
                        <option value="3-5">3–5 years</option>
                        <option value="5+">5+ years</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="career-linkedin" className={labelClass}>
                        LinkedIn profile
                      </label>
                      <input
                        type="url"
                        id="career-linkedin"
                        name="linkedin"
                        placeholder="https://linkedin.com/in/you"
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="career-resume" className={labelClass}>
                        Resume / CV *
                      </label>
                      <input
                        type="file"
                        id="career-resume"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        required
                        className="w-full rounded-xl border border-dashed border-[#2D4CC8]/40 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#2D4CC8]/10 file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-[#2D4CC8] hover:file:bg-[#2D4CC8]/15"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="career-message" className={labelClass}>
                        Why do you want to join CompareX? *
                      </label>
                      <textarea
                        id="career-message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us about your background and why you're interested in CompareX..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-1 size-4 shrink-0 rounded border-[#2D4CC8] text-[#25a36f] focus:ring-[#25a36f]/25"
                    />
                    <span className="text-sm leading-relaxed text-slate-600">
                      I confirm that the information provided is accurate and I agree to CompareX
                      processing my application data for recruitment purposes.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex h-12 w-full items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 text-sm font-medium text-white transition hover:bg-[#3B5BDB] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[220px]"
                    style={{ color: "#fff" }}
                  >
                    <span className="z-10 pr-2 text-white">
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </span>
                    <span className="absolute right-1 inline-flex h-10 w-10 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
                      <span className="mr-3 flex items-center justify-center">
                        <HiArrowRight className="size-5 text-white" aria-hidden />
                      </span>
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
