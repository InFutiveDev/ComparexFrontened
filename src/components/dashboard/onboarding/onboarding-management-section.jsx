"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import {
  createAdminPaymentGateway,
  createAdminReseller,
} from "@/lib/dashboard-api";
import { uploadPgOnboardingFile } from "@/lib/payment";
import { uploadResellerKycFile } from "@/lib/reseller";
import {
  BANK_ACCOUNT_TYPE_OPTIONS,
  PARTNERSHIP_MODEL_OPTIONS,
  YEARS_EXPERIENCE_OPTIONS,
} from "@/lib/reseller-profile-options";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#13203F] outline-none focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500";

const TABS = [
  { id: "pg", label: "Payment Gateways", fr: "FR-MA-04" },
  { id: "reseller", label: "Resellers", fr: "FR-MA-05" },
];

function FileField({ label, hint, accept, uploading, file, onUpload, onClear }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={(e) => {
          const selected = e.target.files?.[0];
          e.target.value = "";
          if (selected) onUpload(selected);
        }}
        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#EEF2FC] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#2D4CC8]"
      />
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      {uploading ? <p className="mt-1 text-xs text-[#2D4CC8]">Uploading…</p> : null}
      {file?.fileName ? (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
          <span className="truncate font-semibold text-[#13203F]">{file.fileName}</span>
          <button type="button" onClick={onClear} className="font-semibold text-red-600">
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}

const emptyPgForm = {
  companyName: "",
  contactPerson: "",
  designation: "",
  email: "",
  phone: "",
  website: "",
  password: "",
  companyLogo: null,
  onboardingChecklist: null,
  verificationStatus: "pending_review",
};

const emptyResellerForm = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  website: "",
  password: "",
  cityState: "",
  partnershipModel: "",
  yearsExperience: "",
  panCard: "",
  aadhaarId: "",
  gstCertificate: null,
  bankAccountHolderName: "",
  bankName: "",
  bankAccountNumber: "",
  bankIfsc: "",
  bankBranch: "",
  bankAccountType: "",
  bankProof: null,
  verificationStatus: "pending_review",
};

export function OnboardingManagementSection() {
  const [tab, setTab] = useState("pg");
  const [pgForm, setPgForm] = useState(emptyPgForm);
  const [resellerForm, setResellerForm] = useState(emptyResellerForm);
  const [uploading, setUploading] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [createdId, setCreatedId] = useState("");

  async function handleUpload(kind, file) {
    setUploading(kind);
    setError("");
    try {
      if (kind === "companyLogo" || kind === "onboardingChecklist") {
        const uploaded = await uploadPgOnboardingFile(
          file,
          kind === "companyLogo" ? "pg-onboarding/logos" : "pg-onboarding/checklists"
        );
        setPgForm((prev) => ({ ...prev, [kind]: uploaded }));
      } else {
        const uploaded = await uploadResellerKycFile(file);
        setResellerForm((prev) => ({ ...prev, [kind]: uploaded }));
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to upload document");
    } finally {
      setUploading("");
    }
  }

  async function submitPg(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");
    setCreatedId("");
    try {
      const data = await createAdminPaymentGateway(pgForm);
      setMessage(data.message || "Payment gateway onboarded");
      setCreatedId(data.paymentGateway?.id || data.id || "");
      setPgForm(emptyPgForm);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to onboard payment gateway");
    } finally {
      setIsSaving(false);
    }
  }

  async function submitReseller(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");
    setCreatedId("");
    try {
      const data = await createAdminReseller(resellerForm);
      setMessage(data.message || "Reseller onboarded");
      setCreatedId(data.reseller?.id || data.id || "");
      setResellerForm(emptyResellerForm);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to onboard reseller");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D4CC8]">
          Master Admin · Onboarding Management
        </p>
        <h2 className="mt-1 text-2xl font-bold text-[#13203F]">Onboarding</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Onboard Payment Gateways and Resellers, upload verification documents, and review
          onboarding status from their detail pages.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setError("");
                setMessage("");
                setCreatedId("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[#2D4CC8] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#2D4CC8]/30"
              }`}
              style={active ? { color: "#fff" } : undefined}
            >
              {item.label}
              <span className={`ml-2 text-[10px] ${active ? "text-white/80" : "text-slate-400"}`}>
                {item.fr}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-500">
        FR-MA-06 · Documents upload via secure file storage and are saved on the profile for
        verification.
      </p>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
          {createdId ? (
            <span className="mt-1 block">
              Open detail:{" "}
              <Link
                href={
                  tab === "pg"
                    ? `/dashboard/payment-gateways/${createdId}`
                    : `/dashboard/resellers/${createdId}`
                }
                className="font-semibold underline"
              >
                Review & verify
              </Link>
            </span>
          ) : null}
        </div>
      ) : null}

      {tab === "pg" ? (
        <form
          onSubmit={submitPg}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h3 className="text-lg font-bold text-[#13203F]">Onboard Payment Gateway</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Company name *</label>
              <input
                required
                className={inputClass}
                value={pgForm.companyName}
                onChange={(e) => setPgForm((prev) => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Contact person *</label>
              <input
                required
                className={inputClass}
                value={pgForm.contactPerson}
                onChange={(e) =>
                  setPgForm((prev) => ({ ...prev, contactPerson: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Designation</label>
              <input
                className={inputClass}
                value={pgForm.designation}
                onChange={(e) => setPgForm((prev) => ({ ...prev, designation: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input
                required
                type="email"
                className={inputClass}
                value={pgForm.email}
                onChange={(e) => setPgForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Phone *</label>
              <input
                required
                className={inputClass}
                value={pgForm.phone}
                onChange={(e) => setPgForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input
                className={inputClass}
                value={pgForm.website}
                onChange={(e) => setPgForm((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Login password *</label>
              <input
                required
                type="password"
                minLength={8}
                className={inputClass}
                value={pgForm.password}
                onChange={(e) => setPgForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Verification status</label>
              <select
                className={inputClass}
                value={pgForm.verificationStatus}
                onChange={(e) =>
                  setPgForm((prev) => ({ ...prev, verificationStatus: e.target.value }))
                }
              >
                <option value="incomplete">Incomplete</option>
                <option value="pending_review">Pending review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <FileField
              label="Company logo"
              hint="PNG/JPG/WEBP"
              accept="image/png,image/jpeg,image/webp,image/gif"
              uploading={uploading === "companyLogo"}
              file={pgForm.companyLogo}
              onUpload={(file) => handleUpload("companyLogo", file)}
              onClear={() => setPgForm((prev) => ({ ...prev, companyLogo: null }))}
            />
            <FileField
              label="Onboarding checklist"
              hint="PDF/DOC/image"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
              uploading={uploading === "onboardingChecklist"}
              file={pgForm.onboardingChecklist}
              onUpload={(file) => handleUpload("onboardingChecklist", file)}
              onClear={() => setPgForm((prev) => ({ ...prev, onboardingChecklist: null }))}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || Boolean(uploading)}
            className="rounded-full bg-[#2D4CC8] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {isSaving ? "Onboarding…" : "Onboard Payment Gateway"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={submitReseller}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h3 className="text-lg font-bold text-[#13203F]">Onboard Reseller</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Full name *</label>
              <input
                required
                className={inputClass}
                value={resellerForm.fullName}
                onChange={(e) =>
                  setResellerForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Business name *</label>
              <input
                required
                className={inputClass}
                value={resellerForm.businessName}
                onChange={(e) =>
                  setResellerForm((prev) => ({ ...prev, businessName: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input
                required
                type="email"
                className={inputClass}
                value={resellerForm.email}
                onChange={(e) => setResellerForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Phone *</label>
              <input
                required
                className={inputClass}
                value={resellerForm.phone}
                onChange={(e) => setResellerForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input
                className={inputClass}
                value={resellerForm.website}
                onChange={(e) => setResellerForm((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Login password *</label>
              <input
                required
                type="password"
                minLength={8}
                className={inputClass}
                value={resellerForm.password}
                onChange={(e) =>
                  setResellerForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>City & state</label>
              <input
                className={inputClass}
                value={resellerForm.cityState}
                onChange={(e) =>
                  setResellerForm((prev) => ({ ...prev, cityState: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Partnership model</label>
              <select
                className={inputClass}
                value={resellerForm.partnershipModel}
                onChange={(e) =>
                  setResellerForm((prev) => ({ ...prev, partnershipModel: e.target.value }))
                }
              >
                <option value="">Select…</option>
                {PARTNERSHIP_MODEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Years of experience</label>
              <select
                className={inputClass}
                value={resellerForm.yearsExperience}
                onChange={(e) =>
                  setResellerForm((prev) => ({ ...prev, yearsExperience: e.target.value }))
                }
              >
                <option value="">Select…</option>
                {YEARS_EXPERIENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Verification status</label>
              <select
                className={inputClass}
                value={resellerForm.verificationStatus}
                onChange={(e) =>
                  setResellerForm((prev) => ({
                    ...prev,
                    verificationStatus: e.target.value,
                  }))
                }
              >
                <option value="incomplete">Incomplete</option>
                <option value="pending_review">Pending review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <h4 className="pt-2 text-sm font-bold text-[#13203F]">KYC & documents</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>PAN</label>
              <input
                className={inputClass}
                value={resellerForm.panCard}
                onChange={(e) =>
                  setResellerForm((prev) => ({
                    ...prev,
                    panCard: e.target.value.toUpperCase(),
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Aadhaar / Govt ID</label>
              <input
                className={inputClass}
                value={resellerForm.aadhaarId}
                onChange={(e) =>
                  setResellerForm((prev) => ({ ...prev, aadhaarId: e.target.value }))
                }
              />
            </div>
            <FileField
              label="GST certificate"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              uploading={uploading === "gstCertificate"}
              file={resellerForm.gstCertificate}
              onUpload={(file) => handleUpload("gstCertificate", file)}
              onClear={() => setResellerForm((prev) => ({ ...prev, gstCertificate: null }))}
            />
            <FileField
              label="Cancelled cheque / bank proof"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              uploading={uploading === "bankProof"}
              file={resellerForm.bankProof}
              onUpload={(file) => handleUpload("bankProof", file)}
              onClear={() => setResellerForm((prev) => ({ ...prev, bankProof: null }))}
            />
            <div>
              <label className={labelClass}>Account holder</label>
              <input
                className={inputClass}
                value={resellerForm.bankAccountHolderName}
                onChange={(e) =>
                  setResellerForm((prev) => ({
                    ...prev,
                    bankAccountHolderName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Bank name</label>
              <input
                className={inputClass}
                value={resellerForm.bankName}
                onChange={(e) =>
                  setResellerForm((prev) => ({ ...prev, bankName: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Account number</label>
              <input
                className={inputClass}
                value={resellerForm.bankAccountNumber}
                onChange={(e) =>
                  setResellerForm((prev) => ({
                    ...prev,
                    bankAccountNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>IFSC</label>
              <input
                className={inputClass}
                value={resellerForm.bankIfsc}
                onChange={(e) =>
                  setResellerForm((prev) => ({
                    ...prev,
                    bankIfsc: e.target.value.toUpperCase(),
                  }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Branch</label>
              <input
                className={inputClass}
                value={resellerForm.bankBranch}
                onChange={(e) =>
                  setResellerForm((prev) => ({ ...prev, bankBranch: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Account type</label>
              <select
                className={inputClass}
                value={resellerForm.bankAccountType}
                onChange={(e) =>
                  setResellerForm((prev) => ({ ...prev, bankAccountType: e.target.value }))
                }
              >
                <option value="">Select…</option>
                {BANK_ACCOUNT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || Boolean(uploading)}
            className="rounded-full bg-[#2D4CC8] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {isSaving ? "Onboarding…" : "Onboard Reseller"}
          </button>
        </form>
      )}
    </div>
  );
}
