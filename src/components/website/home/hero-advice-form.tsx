"use client";

import { FormEvent, useEffect, useState } from "react";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi2";
import { heroFormStepOneFields } from "@/lib/mock-data";

const steps = [
  { id: 1, label: "Your details" },
  { id: 2, label: "Business info" },
  { id: 3, label: "Software needs" },
] as const;

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  role: string;
  department: string;
  companySize: string;
  region: string;
  timeline: string;
  teamSize: string;
  category: string;
  budget: string;
  message: string;
  marketing: boolean;
  termsAndConditions: boolean;
  privacyPolicy: boolean;
};

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  role: "",
  department: "",
  companySize: "",
  region: "",
  timeline: "",
  teamSize: "",
  category: "",
  budget: "",
  message: "",
  marketing: false,
  termsAndConditions: false,
  privacyPolicy: false,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20";

const labelClass = "mb-1.5 block text-left text-sm font-medium text-gray-900";

const checkboxClass =
  "mt-0.5 size-4 shrink-0 cursor-pointer rounded border-slate-300 text-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/25";

const checkboxRowClass = "flex cursor-pointer items-start gap-3 text-left";

export function HeroAdviceForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canGoNext(): boolean {
    if (step === 1) {
      return heroFormStepOneFields.every((field) => Boolean(form[field.name]));
    }
    if (step === 2) {
      return Boolean(form.company.trim() && form.industry && form.teamSize);
    }
    return Boolean(
      form.company.trim() &&
        form.email.trim() &&
        form.phone.trim() &&
        form.budget &&
        form.termsAndConditions &&
        form.privacyPolicy
    );
  }

  function handleNext() {
    if (!canGoNext()) return;
    setStep((s) => Math.min(s + 1, 3));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canGoNext()) return;
    setSubmitted(true);
  }

  useEffect(() => {
    if (!submitted) return;
    const timer = window.setTimeout(() => {
      setSubmitted(false);
      setForm(initialForm);
      setStep(1);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  if (submitted) {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-white/30 bg-white p-8 text-center shadow-xl shadow-slate-950/15 sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#25a36f] text-white">
          <HiCheck className="size-7" aria-hidden />
        </div>
        <h3 className="mt-5 text-xl font-bold text-slate-900">Request received</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Thanks {form.fullName.split(" ")[0] || "there"}! Our team will reach out shortly with tailored software
          recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl  rounded-2xl border border-white/30 bg-white/50 p-6 shadow-xl shadow-slate-950/15 sm:p-8">
      <div className="mb-6">
        <h2 className="text-left text-[30px] font-bold text-[#2D4CC8]">Get in touch with us</h2>
      </div>


      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>

            <h3 className="text-left text-[16px] font-regular text-slate-900 mb-4">Let's get to know you better</h3>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {heroFormStepOneFields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className={labelClass}>
                    {field.label}
                  </label>
                  <select
                    id={field.id}
                    name={field.name}
                    value={form[field.name]}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
          <h3 className="text-left text-[16px] font-regular text-slate-900 mb-4">Tell us about your business</h3>
            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="hero-company" className={labelClass}>
                Company
              </label>
              <select
                id="hero-company"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select company</option>
                <option value="saas">SaaS / Technology</option>
                <option value="retail">Retail / E-commerce</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="hero-team-size" className={labelClass}>
                Team size
              </label>
              <select
                id="hero-team-size"
                value={form.teamSize}
                onChange={(e) => updateField("teamSize", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select team_size</option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            <div>
              <label htmlFor="hero-timeline" className={labelClass}>
                Timeline
              </label>
              <select
                id="hero-timeline"
                value={form.timeline}
                onChange={(e) => updateField("timeline", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select timeline</option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            <div>
              <label htmlFor="hero-region" className={labelClass}>
                Region
              </label>
              <select
                id="hero-region"
                value={form.region}
                onChange={(e) => updateField("region", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select region</option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            <div>
              <label htmlFor="hero-industry" className={labelClass}>
                Industry
              </label>
              <select
                id="hero-industry"
                value={form.industry}
                onChange={(e) => updateField("industry", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select industry</option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            <div>
              <label htmlFor="hero-role" className={labelClass}>
                Role
              </label>
              <select
                id="hero-role"
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select role</option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            <div>
              <label htmlFor="hero-department" className={labelClass}>
                Department
              </label>
              <select
                id="hero-department"
                value={form.department}
                onChange={(e) => updateField("department", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select department</option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            <div>
              <label htmlFor="hero-company-size" className={labelClass}>
                Company size
              </label>
              <select
                id="hero-company-size"
                value={form.companySize}
                onChange={(e) => updateField("companySize", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select company size</option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
          <h3 className="text-left text-[16px] font-regular text-slate-900 mb-4">Tell us about your software needs</h3>
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="hero-category" className={labelClass}>
                Business name
              </label>
              <input
                id="hero-business-name"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="hero-category" className={labelClass}>
                Email
              </label>
              <input
                id="hero-email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="hero-category" className={labelClass}>
                Phone
              </label>
              <input
                id="hero-phone"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="hero-budget" className={labelClass}>
                Monthly budget
              </label>
              <select
                id="hero-budget"
                value={form.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select budget range</option>
                <option value="under-5k">Under ₹5,000</option>
                <option value="5k-25k">₹5,000 – ₹25,000</option>
                <option value="25k-1L">₹25,000 – ₹1,00,000</option>
                <option value="1L+">₹1,00,000+</option>
              </select>
            </div>
            </div>
            <div className="mt-4 space-y-3">
              <label htmlFor="hero-marketing-emails" className={checkboxRowClass}>
                <input
                  id="hero-marketing-emails"
                  name="marketing"
                  type="checkbox"
                  checked={form.marketing}
                  onChange={(e) => updateField("marketing", e.target.checked)}
                  className={checkboxClass}
                />
                <span className="text-sm leading-relaxed text-slate-700">
                  No spam, just software recommendations.
                </span>
              </label>

              <label htmlFor="hero-terms-and-conditions" className={checkboxRowClass}>
                <input
                  id="hero-terms-and-conditions"
                  name="termsAndConditions"
                  type="checkbox"
                  checked={form.termsAndConditions}
                  onChange={(e) => updateField("termsAndConditions", e.target.checked)}
                  className={checkboxClass}
                  required
                />
                <span className="text-sm leading-relaxed text-slate-700">
                  I agree to the{" "}
                  <a href="/terms" className="font-semibold text-[#2D4CC8] underline-offset-2 hover:underline">
                    terms and conditions
                  </a>
                </span>
              </label>

              <label htmlFor="hero-privacy-policy" className={checkboxRowClass}>
                <input
                  id="hero-privacy-policy"
                  name="privacyPolicy"
                  type="checkbox"
                  checked={form.privacyPolicy}
                  onChange={(e) => updateField("privacyPolicy", e.target.checked)}
                  className={checkboxClass}
                  required
                />
                <span className="text-sm leading-relaxed text-slate-700">
                  I agree to the{" "}
                  <a href="/privacy" className="font-semibold text-[#2D4CC8] underline-offset-2 hover:underline">
                    privacy policy
                  </a>
                </span>
              </label>
            </div>
          </>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <HiArrowLeft className="size-4" aria-hidden />
              Back
            </button>
          ) : (
            <div className="w-fit h-fit" />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext()}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2D4CC8] px-10 py-3 text-sm font-semibold text-white transition hover:bg-[#2542b6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <HiArrowRight className="size-4" aria-hidden />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canGoNext()}
              className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2D4CC8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2542b6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit
              <HiCheck className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
