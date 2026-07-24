"use client";

import { useEffect, useState } from "react";
import {
  HiBuildingOffice2,
  HiCheckCircle,
  HiCurrencyRupee,
  HiPaperAirplane,
  HiUser,
} from "react-icons/hi2";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiError } from "@/lib/api";
import { submitMerchantPanelLead } from "@/lib/merchant";
import { sanitizePhoneInput, validateContactFields } from "@/lib/validation";

const categories = [
  { value: "ecommerce-d2c", label: "Ecommerce / D2C" },
  { value: "b2b-manufacturing", label: "B2B / Manufacturing" },
  { value: "saas-subscription-platforms", label: "SaaS / Subscription Platforms" },
  { value: "education-healthcare", label: "Education / Healthcare Services" },
  { value: "travel-bill-payments", label: "Travel / Bill Payments" },
  { value: "other-businesses", label: "Freelancers / Other Businesses" },
];

const initialForm = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  merchantCategory: "",
  estimatedMonthlyVolume: "",
};

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

function FieldLabel({ children }) {
  return (
    <span className="text-sm font-semibold text-slate-600">
      {children} <span className="text-red-500">*</span>
    </span>
  );
}

export function MerchantLeadSubmissionForm() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedLead, setSubmittedLead] = useState(null);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      contactName: current.contactName || user?.name || "",
      email: current.email || user?.email || "",
    }));
  }, [user]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const contactError = validateContactFields({
      email: form.email,
      phone: form.phone,
    });
    if (contactError) {
      setError(contactError);
      return;
    }
    if (Number(form.estimatedMonthlyVolume) <= 0) {
      setError("Estimated monthly volume must be greater than zero");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const data = await submitMerchantPanelLead({
        ...form,
        businessName: form.businessName.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        estimatedMonthlyVolume: Number(form.estimatedMonthlyVolume),
      });
      setSubmittedLead(data.lead);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit merchant lead");
    } finally {
      setIsSubmitting(false);
    }
  }

  function submitAnother() {
    setSubmittedLead(null);
    setError("");
    setForm({
      ...initialForm,
      contactName: user?.name || "",
      email: user?.email || "",
    });
  }

  if (submittedLead) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <HiCheckCircle className="mx-auto size-14 text-emerald-500" />
        <h2 className="mt-4 text-2xl font-bold text-[#13203F]">
          Lead submitted successfully
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Your lead for <strong>{submittedLead.businessName}</strong> has been recorded
          and is ready for review.
        </p>
        <p className="mt-3 text-xs text-slate-500">Lead ID: {submittedLead.id}</p>
        <button
          type="button"
          onClick={submitAnother}
          className="mt-6 rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white"
          style={{ color: "#fff" }}
        >
          Submit another lead
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#13203F] sm:text-2xl">
          Lead Submission Form
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          FR-MC-04 · Submit your business and transaction requirements for payment
          gateway evaluation.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#EEF2FC] text-[#2D4CC8]">
            <HiBuildingOffice2 className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#13203F]">Merchant lead details</h3>
            <p className="text-xs text-slate-500">All fields are required.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label>
            <FieldLabel>Business name</FieldLabel>
            <input
              required
              className={inputClass}
              value={form.businessName}
              onChange={(event) => updateField("businessName", event.target.value)}
              placeholder="Your registered business name"
            />
          </label>

          <label>
            <FieldLabel>Contact person</FieldLabel>
            <div className="relative">
              <HiUser className="pointer-events-none absolute left-3 top-4 size-4 text-slate-400" />
              <input
                required
                className={`${inputClass} pl-10`}
                value={form.contactName}
                onChange={(event) => updateField("contactName", event.target.value)}
              />
            </div>
          </label>

          <label>
            <FieldLabel>Email address</FieldLabel>
            <input
              required
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@business.com"
            />
          </label>

          <label>
            <FieldLabel>Phone number</FieldLabel>
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={11}
              className={inputClass}
              value={form.phone}
              onChange={(event) =>
                updateField("phone", sanitizePhoneInput(event.target.value))
              }
              placeholder="10–11 digits mobile number"
            />
          </label>

          <label>
            <FieldLabel>Merchant category</FieldLabel>
            <select
              required
              className={inputClass}
              value={form.merchantCategory}
              onChange={(event) => updateField("merchantCategory", event.target.value)}
            >
              <option value="">Select category…</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <FieldLabel>Estimated monthly volume</FieldLabel>
            <div className="relative">
              <HiCurrencyRupee className="pointer-events-none absolute left-3 top-4 size-4 text-slate-400" />
              <input
                required
                type="number"
                min="1"
                step="1"
                className={`${inputClass} pl-10`}
                value={form.estimatedMonthlyVolume}
                onChange={(event) =>
                  updateField("estimatedMonthlyVolume", event.target.value)
                }
                placeholder="Amount in INR per month"
              />
            </div>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-[#2D4CC8] px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            <HiPaperAirplane className="size-4" />
            {isSubmitting ? "Submitting…" : "Submit lead"}
          </button>
        </div>
      </form>
    </div>
  );
}
