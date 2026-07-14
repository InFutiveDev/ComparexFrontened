"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  HiArrowLeft,
  HiArrowRight,
  HiCheck,
  HiChevronDown,
  HiMapPin,
  HiOutlineXMark,
} from "react-icons/hi2";
import { savePgOnboardingProfile } from "@/lib/pg-onboarding-storage";
import {
  serializeOnboardingForApi,
  updateMyPaymentProfile,
  uploadPgOnboardingFile,
} from "@/lib/payment";
import { ApiError } from "@/lib/api";
import {
  APPROVAL_COMPLEXITY_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  COUNTRY_OPTIONS,
  FRM_RESPONSE_TIME_OPTIONS,
  MAX_SMART_TAGS,
  MOBILE_SDK_OPTIONS,
  ONBOARDING_TAT_OPTIONS,
  PCI_DSS_OPTIONS,
  PLUGIN_OPTIONS,
  RBI_PAPG_OPTIONS,
  REFUND_SLA_OPTIONS,
  RESTRICTED_CATEGORY_OPTIONS,
  SDK_OPTIONS,
  SERVICE_TYPES,
  SETTLEMENT_CURRENCY_OPTIONS,
  SETTLEMENT_CYCLE_OPTIONS,
  SETTLEMENT_INFRASTRUCTURE_OPTIONS,
  SMART_TAG_OPTIONS,
  SORT_BY_OPTIONS,
  SUPPORT_AVAILABILITY_OPTIONS,
  YES_NO_OPTIONS,
  getFeaturesForServiceType,
  getVisibleSteps,
  initialOnboardingForm,
  isFieldVisible,
  validateStep,
} from "@/lib/pg-onboarding-config";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#2D4CC8] focus:ring-2 focus:ring-[#2D4CC8]/20";

const labelClass = "mb-1.5 block text-left text-sm font-semibold text-[#13203F]";

function normalizeOptions(options) {
  return options.map((option) =>
    typeof option === "string"
      ? { value: option, label: option }
      : { value: option.value, label: option.label }
  );
}

function FormSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const normalized = useMemo(() => normalizeOptions(options), [options]);
  const selected = normalized.find((option) => option.value === value);

  function updateMenuPosition() {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuMaxHeight = 220;
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom - gap;
    const spaceAbove = rect.top - gap;
    const openUpward = spaceBelow < 160 && spaceAbove > spaceBelow;

    setMenuPosition({
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(menuMaxHeight, Math.max(120, openUpward ? spaceAbove : spaceBelow)),
      top: openUpward ? undefined : rect.bottom + gap,
      bottom: openUpward ? window.innerHeight - rect.top + gap : undefined,
    });
  }

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
      setOpen(false);
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
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          setOpen(true);
          updateMenuPosition();
        }}
        className={`${inputClass} flex items-center justify-between gap-2 text-left ${
          selected ? "text-[#13203F]" : "text-slate-400"
        }`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <HiChevronDown
          className={`size-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && menuPosition && typeof document !== "undefined"
        ? createPortal(
            <ul
              data-form-select-menu
              role="listbox"
              className="fixed z-[120] overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
              style={{
                left: menuPosition.left,
                width: menuPosition.width,
                top: menuPosition.top,
                bottom: menuPosition.bottom,
                maxHeight: menuPosition.maxHeight,
              }}
            >
              {normalized.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className={`block w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#f2f6fb] hover:text-[#2D4CC8] ${
                        isSelected
                          ? "bg-[#EEF2FC] font-semibold text-[#2D4CC8]"
                          : "text-[#13203F]"
                      }`}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body
          )
        : null}
    </div>
  );
}

function ProgressBar({ step, total, label }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        <span>
          Step {step} of {total}
        </span>
        <span className="text-[#13203F]">{label}</span>
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

function ToggleField({ id, label, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-sm font-semibold text-[#13203F]">{label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-[#2D4CC8]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

function MultiSelectChips({ options, value, onChange, max }) {
  function toggle(item) {
    const selected = value.includes(item);
    if (selected) {
      onChange(value.filter((v) => v !== item));
      return;
    }
    if (max && value.length >= max) return;
    onChange([...value, item]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const item = typeof option === "string" ? option : option.value;
        const label = typeof option === "string" ? option : option.label;
        const selected = value.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => toggle(item)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              selected
                ? "border-[#2D4CC8] bg-[#EEF2FC] text-[#2D4CC8]"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#2D4CC8]/40"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Field({ show, children }) {
  if (!show) return null;
  return children;
}

function getFileMeta(value) {
  if (!value) return null;
  if (typeof File !== "undefined" && value instanceof File) {
    return { fileName: value.name };
  }
  if (typeof value === "string") {
    return { fileName: value };
  }
  if (typeof value === "object") {
    return {
      fileName: value.fileName || value.name || null,
      url: value.url || null,
      key: value.key || null,
      mimeType: value.mimeType || null,
      size: value.size || null,
    };
  }
  return null;
}

function formatFileSize(size) {
  if (!size || Number.isNaN(Number(size))) return null;
  const bytes = Number(size);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileUploadField({
  id,
  label,
  value,
  accept,
  hint,
  uploading,
  disabled,
  onUpload,
  onClear,
  imagePreview = false,
}) {
  const meta = getFileMeta(value);
  const isImage =
    imagePreview &&
    Boolean(
      meta?.url &&
        (meta.mimeType?.startsWith("image/") ||
          /\.(png|jpe?g|webp|gif)$/i.test(meta.fileName || ""))
    );

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
        <input
          id={id}
          type="file"
          accept={accept}
          disabled={disabled || uploading}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            e.target.value = "";
            if (file) onUpload?.(file);
          }}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#EEF2FC] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#2D4CC8] disabled:cursor-not-allowed disabled:opacity-60"
        />
        {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
        {uploading ? (
          <p className="mt-2 text-xs font-medium text-[#2D4CC8]">Uploading…</p>
        ) : null}
        {meta?.fileName ? (
          <div className="mt-3 flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <div className="min-w-0 flex-1">
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={meta.url}
                  alt={meta.fileName}
                  className="mb-2 h-16 w-16 rounded-lg border border-slate-200 object-contain bg-white"
                />
              ) : null}
              <p className="truncate text-sm font-semibold text-[#13203F]">{meta.fileName}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {[formatFileSize(meta.size), "Uploaded"].filter(Boolean).join(" · ")}
              </p>
              {meta.url ? (
                <a
                  href={meta.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex text-xs font-semibold text-[#2D4CC8] hover:underline"
                >
                  View file
                </a>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClear}
              disabled={disabled || uploading}
              className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function OnboardingFormModal({ open, onClose, initialData, onSaved, persistToApi = true }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(() => ({
    ...initialOnboardingForm,
    ...(initialData || {}),
  }));
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [featureQuery, setFeatureQuery] = useState("");
  const [featureMenuOpen, setFeatureMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploadingField, setUploadingField] = useState("");
  const [uploadError, setUploadError] = useState("");

  const visibleSteps = useMemo(() => getVisibleSteps(form.serviceType), [form.serviceType]);
  const currentStep = visibleSteps[stepIndex] || visibleSteps[0];
  const isLastStep = stepIndex === visibleSteps.length - 1;

  const availableFeatures = useMemo(
    () => getFeaturesForServiceType(form.serviceType),
    [form.serviceType]
  );

  const filteredFeatures = availableFeatures.filter((feature) => {
    if (form.features.includes(feature)) return false;
    const query = featureQuery.trim().toLowerCase();
    if (!query) return true;
    return feature.toLowerCase().includes(query);
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStepIndex(0);
      setSubmitted(false);
      setDraftSaved(false);
      setFeatureQuery("");
      setFeatureMenuOpen(false);
      return;
    }

    setStepIndex(0);
    setForm({
      ...initialOnboardingForm,
      ...(initialData || {}),
      companyLogo: getFileMeta(initialData?.companyLogo),
      onboardingChecklist: getFileMeta(initialData?.onboardingChecklist),
    });
    setSubmitted(false);
    setDraftSaved(false);
    setFeatureQuery("");
    setFeatureMenuOpen(false);
    setIsSaving(false);
    setSaveError("");
    setUploadingField("");
    setUploadError("");
    // Only reset when modal opens, not when parent profile refreshes mid-submit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (stepIndex > visibleSteps.length - 1) {
      setStepIndex(Math.max(0, visibleSteps.length - 1));
    }
  }, [visibleSteps, stepIndex]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function show(fieldKey) {
    return isFieldVisible(form.serviceType, fieldKey);
  }

  function toggleSmartTag(tagValue) {
    setForm((prev) => {
      const selected = prev.smartTags.includes(tagValue);
      if (selected) {
        return { ...prev, smartTags: prev.smartTags.filter((t) => t !== tagValue) };
      }
      if (prev.smartTags.length >= MAX_SMART_TAGS) return prev;
      return { ...prev, smartTags: [...prev.smartTags, tagValue] };
    });
  }

  function addFeature(feature) {
    setForm((prev) => {
      if (prev.features.includes(feature)) return prev;
      return { ...prev, features: [...prev.features, feature] };
    });
    setFeatureQuery("");
    setFeatureMenuOpen(false);
  }

  function removeFeature(feature) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((item) => item !== feature),
    }));
  }

  function canContinue() {
    return validateStep(currentStep?.id, form);
  }

  async function handleFileUpload(field, file, folder) {
    if (!file || isSaving) return;

    setUploadingField(field);
    setUploadError("");

    try {
      const uploaded = await uploadPgOnboardingFile(file, folder);
      updateField(field, uploaded);
    } catch (err) {
      setUploadError(
        err instanceof ApiError
          ? err.message
          : `Failed to upload ${field === "companyLogo" ? "company logo" : "onboarding checklist"}`
      );
    } finally {
      setUploadingField("");
    }
  }

  function clearUploadedFile(field) {
    updateField(field, null);
    setUploadError("");
  }

  async function persistOnboarding({ submit = false } = {}) {
    const localSaved = savePgOnboardingProfile(form);

    if (!persistToApi) {
      onSaved?.(localSaved);
      return localSaved;
    }

    const response = await updateMyPaymentProfile({
      section: submit ? "submit" : "draft",
      submit,
      onboarding: serializeOnboardingForApi(form),
    });

    const gateway = response?.paymentGateway;
    const nextOnboarding = gateway?.onboarding || {};
    const saved = {
      ...form,
      ...nextOnboarding,
      companyLogo: getFileMeta(nextOnboarding.companyLogo ?? form.companyLogo),
      onboardingChecklist: getFileMeta(
        nextOnboarding.onboardingChecklist ?? form.onboardingChecklist
      ),
      verificationStatus: gateway?.verificationStatus,
      profileCompletion: gateway?.profileCompletion,
      updatedAt: new Date().toISOString(),
    };

    savePgOnboardingProfile(saved);
    onSaved?.(saved, gateway);
    return saved;
  }

  async function handleSaveDraft() {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError("");
    try {
      await persistOnboarding({ submit: false });
      setDraftSaved(true);
      window.setTimeout(() => setDraftSaved(false), 2500);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSubmit() {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError("");
    try {
      await persistOnboarding({ submit: true });
      setSubmitted(true);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to submit onboarding");
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    onClose?.();
  }

  const selectedService =
    SERVICE_TYPES.find((option) => option.value === form.serviceType)?.label || "—";
  const selectedSmartTags = SMART_TAG_OPTIONS.filter((tag) =>
    form.smartTags.includes(tag.value)
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-[#13203F]/50"
        aria-label="Close dialog"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-form-title"
        className="relative flex max-h-[min(92vh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-[#eef2fa] shadow-2xl shadow-[#13203F]/20"
      >
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-5 py-4">
          <h2 id="onboarding-form-title" className="text-lg font-bold text-[#13203F] sm:text-xl">
            Onboarding Form
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#2D4CC8]/30 hover:text-[#13203F]"
            aria-label="Close"
          >
            <HiOutlineXMark className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#25a36f] text-white shadow-lg shadow-[#25a36f]/30">
                <HiCheck className="size-8" aria-hidden />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-[#13203F]">Onboarding submitted</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                Thanks — your payment gateway profile is saved and submitted for review. You can
                track status from Complete Profile.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                We&apos;ve received your onboarding details and will use them to power comparison,
                discovery, and Talk to Expert routing.
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
          ) : (
            <>
              <ProgressBar
                step={stepIndex + 1}
                total={visibleSteps.length}
                label={currentStep?.label}
              />

              {currentStep?.id === "service-type" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Select Your Category
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      Select your primary service offering. The form will adapt to show only
                      relevant fields for your solution type.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {SERVICE_TYPES.map((option) => {
                      const selected = form.serviceType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateField("serviceType", option.value)}
                          className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border bg-white px-3 py-5 text-center transition ${
                            selected
                              ? "border-[#2D4CC8] shadow-sm ring-2 ring-[#2D4CC8]/20"
                              : "border-slate-200 hover:border-[#2D4CC8]/40 hover:shadow-sm"
                          }`}
                        >
                          <span className="text-2xl" aria-hidden>
                            {option.emoji}
                          </span>
                          <span className="text-sm font-semibold text-[#13203F]">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {currentStep?.id === "company" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Company Information
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      These details will help merchants discover and compare your offering.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Legal Entity Name</label>
                      <input
                        className={inputClass}
                        value={form.legalEntityName}
                        onChange={(e) => updateField("legalEntityName", e.target.value)}
                        placeholder="Registered company name"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Brand Name</label>
                      <input
                        className={inputClass}
                        value={form.brandName}
                        onChange={(e) => updateField("brandName", e.target.value)}
                        placeholder="Enter company / product name"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FileUploadField
                        id="company-logo"
                        label="Company Logo"
                        value={form.companyLogo}
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        hint="PNG, JPG, WEBP or GIF — max 10MB"
                        uploading={uploadingField === "companyLogo"}
                        disabled={isSaving}
                        imagePreview
                        onUpload={(file) =>
                          handleFileUpload("companyLogo", file, "pg-onboarding/logos")
                        }
                        onClear={() => clearUploadedFile("companyLogo")}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Website URL</label>
                      <input
                        type="url"
                        className={inputClass}
                        value={form.websiteUrl}
                        onChange={(e) => updateField("websiteUrl", e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Headquarters Country</label>
                      <FormSelect
                        value={form.headquartersCountry}
                        onChange={(v) => updateField("headquartersCountry", v)}
                        placeholder="Select country"
                        options={COUNTRY_OPTIONS}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Headquarters City</label>
                      <input
                        className={inputClass}
                        value={form.headquartersCity}
                        onChange={(e) => updateField("headquartersCity", e.target.value)}
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Year Established</label>
                      <input
                        className={inputClass}
                        inputMode="numeric"
                        maxLength={4}
                        value={form.yearEstablished}
                        onChange={(e) =>
                          updateField(
                            "yearEstablished",
                            e.target.value.replace(/\D/g, "").slice(0, 4)
                          )
                        }
                        placeholder="2018"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Merchant Base Count</label>
                      <input
                        className={inputClass}
                        inputMode="numeric"
                        value={form.merchantBaseCount}
                        onChange={(e) =>
                          updateField("merchantBaseCount", e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="e.g. 5000"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Countries Supported</label>
                      <MultiSelectChips
                        options={COUNTRY_OPTIONS}
                        value={form.countriesSupported}
                        onChange={(v) => updateField("countriesSupported", v)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>RBI / PAPG Status</label>
                      <FormSelect
                        value={form.rbiPapgStatus}
                        onChange={(v) => updateField("rbiPapgStatus", v)}
                        placeholder="Select status"
                        options={RBI_PAPG_OPTIONS}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>PCI DSS Status</label>
                      <FormSelect
                        value={form.pciDssStatus}
                        onChange={(v) => updateField("pciDssStatus", v)}
                        placeholder="Select compliance"
                        options={PCI_DSS_OPTIONS}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Company Overview</label>
                      <textarea
                        rows={4}
                        maxLength={150}
                        className={`${inputClass} resize-y`}
                        value={form.companyOverview}
                        onChange={(e) => updateField("companyOverview", e.target.value)}
                        placeholder="Describe your offering in up to 150 characters"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep?.id === "pricing" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Pricing & Commercials
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      Fields adapt based on your selected service type.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field show={show("upiMdr")}>
                      <div>
                        <label className={labelClass}>UPI MDR (%)</label>
                        <input
                          className={inputClass}
                          value={form.upiMdr}
                          onChange={(e) => updateField("upiMdr", e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </Field>
                    <Field show={show("creditCardMdr")}>
                      <div>
                        <label className={labelClass}>Credit Card MDR (%)</label>
                        <input
                          className={inputClass}
                          value={form.creditCardMdr}
                          onChange={(e) => updateField("creditCardMdr", e.target.value)}
                          placeholder="1.80"
                        />
                      </div>
                    </Field>
                    <Field show={show("debitCardMdr")}>
                      <div>
                        <label className={labelClass}>Debit Card MDR (%)</label>
                        <input
                          className={inputClass}
                          value={form.debitCardMdr}
                          onChange={(e) => updateField("debitCardMdr", e.target.value)}
                          placeholder="0.90"
                        />
                      </div>
                    </Field>
                    <Field show={show("internationalMdr")}>
                      <div>
                        <label className={labelClass}>International MDR (%)</label>
                        <input
                          className={inputClass}
                          value={form.internationalMdr}
                          onChange={(e) => updateField("internationalMdr", e.target.value)}
                          placeholder="3.00"
                        />
                      </div>
                    </Field>
                    <Field show={show("walletCharges")}>
                      <div>
                        <label className={labelClass}>Wallet Charges (%)</label>
                        <input
                          className={inputClass}
                          value={form.walletCharges}
                          onChange={(e) => updateField("walletCharges", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("netBankingCharges")}>
                      <div>
                        <label className={labelClass}>Net Banking Charges (%)</label>
                        <input
                          className={inputClass}
                          value={form.netBankingCharges}
                          onChange={(e) => updateField("netBankingCharges", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("emiBnplCharges")}>
                      <div>
                        <label className={labelClass}>EMI & BNPL Charges (%)</label>
                        <input
                          className={inputClass}
                          value={form.emiBnplCharges}
                          onChange={(e) => updateField("emiBnplCharges", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("refundFee")}>
                      <div>
                        <label className={labelClass}>Refund Fee (₹)</label>
                        <input
                          className={inputClass}
                          value={form.refundFee}
                          onChange={(e) => updateField("refundFee", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("chargebackFee")}>
                      <div>
                        <label className={labelClass}>Dispute & Chargeback (₹)</label>
                        <input
                          className={inputClass}
                          value={form.chargebackFee}
                          onChange={(e) => updateField("chargebackFee", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("amcPlatformFees")}>
                      <div>
                        <label className={labelClass}>AMC / Platform Fees (₹/month)</label>
                        <input
                          className={inputClass}
                          value={form.amcPlatformFees}
                          onChange={(e) => updateField("amcPlatformFees", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("setupFees")}>
                      <div>
                        <label className={labelClass}>Setup Fees (₹)</label>
                        <input
                          className={inputClass}
                          value={form.setupFees}
                          onChange={(e) => updateField("setupFees", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("instantSettlementCharges")}>
                      <div>
                        <label className={labelClass}>Instant Settlement Charges (%)</label>
                        <input
                          className={inputClass}
                          value={form.instantSettlementCharges}
                          onChange={(e) => updateField("instantSettlementCharges", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("hardwareCost")}>
                      <div>
                        <label className={labelClass}>Hardware Cost (₹)</label>
                        <input
                          className={inputClass}
                          value={form.hardwareCost}
                          onChange={(e) => updateField("hardwareCost", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("annualMaintenanceContract")}>
                      <div>
                        <label className={labelClass}>Annual Maintenance Contract (₹)</label>
                        <input
                          className={inputClass}
                          value={form.annualMaintenanceContract}
                          onChange={(e) => updateField("annualMaintenanceContract", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("monthlyRental")}>
                      <div>
                        <label className={labelClass}>Monthly Rental (₹)</label>
                        <input
                          className={inputClass}
                          value={form.monthlyRental}
                          onChange={(e) => updateField("monthlyRental", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("forexMarkup")}>
                      <div>
                        <label className={labelClass}>Forex Markup / Margin (%)</label>
                        <input
                          className={inputClass}
                          value={form.forexMarkup}
                          onChange={(e) => updateField("forexMarkup", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("settlementCurrency")}>
                      <div>
                        <label className={labelClass}>Settlement Currency</label>
                        <FormSelect
                        value={form.settlementCurrency}
                        onChange={(v) => updateField("settlementCurrency", v)}
                        placeholder="Select currency"
                        options={SETTLEMENT_CURRENCY_OPTIONS}
                      />
                      </div>
                    </Field>
                    <Field show={show("settlementInfrastructure")}>
                      <div>
                        <label className={labelClass}>Settlement Infrastructure</label>
                        <FormSelect
                        value={form.settlementInfrastructure}
                        onChange={(v) => updateField("settlementInfrastructure", v)}
                        placeholder="Select infrastructure"
                        options={SETTLEMENT_INFRASTRUCTURE_OPTIONS}
                      />
                      </div>
                    </Field>
                    <Field show={show("multiCurrencyWallet")}>
                      <div>
                        <label className={labelClass}>Multi Currency Wallet</label>
                        <FormSelect
                        value={form.multiCurrencyWallet}
                        onChange={(v) => updateField("multiCurrencyWallet", v)}
                        placeholder="Select"
                        options={YES_NO_OPTIONS}
                      />
                      </div>
                    </Field>
                    <Field show={show("perTransactionFee")}>
                      <div>
                        <label className={labelClass}>Per Transaction Fee (₹)</label>
                        <input
                          className={inputClass}
                          value={form.perTransactionFee}
                          onChange={(e) => updateField("perTransactionFee", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("monthlyRetainer")}>
                      <div>
                        <label className={labelClass}>Monthly Retainer (₹)</label>
                        <input
                          className={inputClass}
                          value={form.monthlyRetainer}
                          onChange={(e) => updateField("monthlyRetainer", e.target.value)}
                        />
                      </div>
                    </Field>
                    <Field show={show("offersPromotions")}>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Offers / Promotions</label>
                        <textarea
                          rows={3}
                          className={`${inputClass} resize-y`}
                          value={form.offersPromotions}
                          onChange={(e) => updateField("offersPromotions", e.target.value)}
                          placeholder="Describe active offers or promotions"
                        />
                      </div>
                    </Field>
                  </div>
                </div>
              ) : null}

              {currentStep?.id === "operations" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Operational & Onboarding
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      Onboarding, settlement, and support details for merchants.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FileUploadField
                        id="onboarding-checklist"
                        label="Onboarding Checklist"
                        value={form.onboardingChecklist}
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                        hint="PDF, DOC, DOCX or image — max 10MB"
                        uploading={uploadingField === "onboardingChecklist"}
                        disabled={isSaving}
                        onUpload={(file) =>
                          handleFileUpload(
                            "onboardingChecklist",
                            file,
                            "pg-onboarding/checklists"
                          )
                        }
                        onClear={() => clearUploadedFile("onboardingChecklist")}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Onboarding TAT</label>
                      <FormSelect
                        value={form.onboardingTat}
                        onChange={(v) => updateField("onboardingTat", v)}
                        placeholder="Select onboarding timeline"
                        options={ONBOARDING_TAT_OPTIONS}
                      />
                    </div>
                    <Field show={show("settlementCycle")}>
                      <div>
                        <label className={labelClass}>Settlement Cycle</label>
                        <FormSelect
                        value={form.settlementCycle}
                        onChange={(v) => updateField("settlementCycle", v)}
                        placeholder="Select settlement cycle"
                        options={SETTLEMENT_CYCLE_OPTIONS}
                      />
                      </div>
                    </Field>
                    <Field show={show("refundSla")}>
                      <div>
                        <label className={labelClass}>Refund SLA</label>
                        <FormSelect
                        value={form.refundSla}
                        onChange={(v) => updateField("refundSla", v)}
                        placeholder="Select refund SLA"
                        options={REFUND_SLA_OPTIONS}
                      />
                      </div>
                    </Field>
                    <div>
                      <label className={labelClass}>Approval Complexity</label>
                      <FormSelect
                        value={form.approvalComplexity}
                        onChange={(v) => updateField("approvalComplexity", v)}
                        placeholder="Select complexity"
                        options={APPROVAL_COMPLEXITY_OPTIONS}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Merchant Support Availability</label>
                      <FormSelect
                        value={form.merchantSupportAvailability}
                        onChange={(v) => updateField("merchantSupportAvailability", v)}
                        placeholder="Select availability"
                        options={SUPPORT_AVAILABILITY_OPTIONS}
                      />
                    </div>
                    <Field show={show("averageResponseTime")}>
                      <div>
                        <label className={labelClass}>Average Response Time</label>
                        <FormSelect
                        value={form.averageResponseTime}
                        onChange={(v) => updateField("averageResponseTime", v)}
                        placeholder="Select response time"
                        options={FRM_RESPONSE_TIME_OPTIONS}
                      />
                      </div>
                    </Field>
                    <div className="space-y-3 sm:col-span-2">
                      <ToggleField
                        id="dedicated-am"
                        label="Dedicated Account Manager"
                        checked={form.dedicatedAccountManager}
                        onChange={(v) => updateField("dedicatedAccountManager", v)}
                      />
                      <ToggleField
                        id="escalation-support"
                        label="Escalation Support"
                        checked={form.escalationSupport}
                        onChange={(v) => updateField("escalationSupport", v)}
                      />
                      <Field show={show("instantSettlementAvailability")}>
                        <ToggleField
                          id="instant-settlement"
                          label="Instant Settlement Availability"
                          checked={form.instantSettlementAvailability}
                          onChange={(v) => updateField("instantSettlementAvailability", v)}
                        />
                      </Field>
                      <Field show={show("internationalPaymentsSupport")}>
                        <ToggleField
                          id="intl-payments"
                          label="International Payments Support"
                          checked={form.internationalPaymentsSupport}
                          onChange={(v) => updateField("internationalPaymentsSupport", v)}
                        />
                      </Field>
                      <Field show={show("offlineModeSupport")}>
                        <ToggleField
                          id="offline-mode"
                          label="Offline Mode Support"
                          checked={form.offlineModeSupport}
                          onChange={(v) => updateField("offlineModeSupport", v)}
                        />
                      </Field>
                      <Field show={show("gstBillingSupport")}>
                        <ToggleField
                          id="gst-billing"
                          label="GST Billing Support"
                          checked={form.gstBillingSupport}
                          onChange={(v) => updateField("gstBillingSupport", v)}
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Restricted Categories</label>
                      <MultiSelectChips
                        options={RESTRICTED_CATEGORY_OPTIONS}
                        value={form.restrictedCategories}
                        onChange={(v) => updateField("restrictedCategories", v)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Best Suited Business Types</label>
                      <MultiSelectChips
                        options={BUSINESS_TYPE_OPTIONS}
                        value={form.bestSuitedBusinessTypes}
                        onChange={(v) => updateField("bestSuitedBusinessTypes", v)}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep?.id === "smart-tags" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Smart Tags
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      Select up to {MAX_SMART_TAGS} tags merchants can use to understand your
                      strengths.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {SMART_TAG_OPTIONS.map((tag) => {
                      const selected = form.smartTags.includes(tag.value);
                      return (
                        <button
                          key={tag.value}
                          type="button"
                          onClick={() => toggleSmartTag(tag.value)}
                          className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                            selected
                              ? "border-[#2D4CC8] bg-[#EEF2FC] text-[#13203F] ring-2 ring-[#2D4CC8]/20"
                              : "border-[#c7d2fe] bg-[#eef2ff] text-[#13203F] hover:border-[#2D4CC8]/40"
                          }`}
                        >
                          <span aria-hidden>{tag.emoji}</span>
                          <span>{tag.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#13203F]">Selected Tags</p>
                      <p className="text-xs text-slate-500">
                        {form.smartTags.length}/{MAX_SMART_TAGS}
                      </p>
                    </div>
                    {form.smartTags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {SMART_TAG_OPTIONS.filter((tag) =>
                          form.smartTags.includes(tag.value)
                        ).map((tag) => (
                          <span
                            key={tag.value}
                            className="inline-flex items-center gap-2 rounded-full border border-[#2D4CC8]/25 bg-[#EEF2FC] px-3 py-1.5 text-sm font-medium text-[#13203F]"
                          >
                            <span aria-hidden>{tag.emoji}</span>
                            <span>{tag.label}</span>
                            <button
                              type="button"
                              onClick={() => toggleSmartTag(tag.value)}
                              className="cursor-pointer text-[#2D4CC8]/70 transition hover:text-[#13203F]"
                              aria-label={`Remove ${tag.label}`}
                            >
                              <HiOutlineXMark className="size-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        No tags selected yet. Click tags above to add them here.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Suggest New Tags</label>
                    <input
                      className={inputClass}
                      value={form.suggestNewTag}
                      onChange={(e) => updateField("suggestNewTag", e.target.value)}
                      placeholder="Suggest a tag for review"
                    />
                  </div>
                </div>
              ) : null}

              {currentStep?.id === "sort-by" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Sort By Mapping
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      Choose discovery categories where your offering should appear.
                    </p>
                  </div>
                  <MultiSelectChips
                    options={SORT_BY_OPTIONS}
                    value={form.sortByCategories}
                    onChange={(v) => updateField("sortByCategories", v)}
                  />
                </div>
              ) : null}

              {currentStep?.id === "features" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Product Features
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      Add products, APIs, integrations, and infrastructure capabilities.
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Search & Add Features</label>
                    <div className="relative">
                      <input
                        value={featureQuery}
                        onChange={(e) => {
                          setFeatureQuery(e.target.value);
                          setFeatureMenuOpen(true);
                        }}
                        onFocus={() => setFeatureMenuOpen(true)}
                        onBlur={() => window.setTimeout(() => setFeatureMenuOpen(false), 120)}
                        placeholder="Search features like Subscription Billing, Smart Routing, Payouts..."
                        className={inputClass}
                        autoComplete="off"
                      />
                      {featureMenuOpen && filteredFeatures.length > 0 ? (
                        <ul className="absolute z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                          {filteredFeatures.map((feature) => (
                            <li key={feature}>
                              <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => addFeature(feature)}
                                className="block w-full px-4 py-2.5 text-left text-sm text-[#13203F] transition hover:bg-[#f2f6fb] hover:text-[#2D4CC8]"
                              >
                                {feature}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    {form.features.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {form.features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center gap-2 rounded-full border border-[#2D4CC8]/20 bg-[#EEF2FC] px-3 py-1.5 text-xs font-semibold text-[#2D4CC8]"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => removeFeature(feature)}
                              className="cursor-pointer text-[#2D4CC8]/70 transition hover:text-[#13203F]"
                              aria-label={`Remove ${feature}`}
                            >
                              <HiOutlineXMark className="size-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label className={labelClass}>Suggest New Feature</label>
                    <input
                      className={inputClass}
                      value={form.suggestNewFeature}
                      onChange={(e) => updateField("suggestNewFeature", e.target.value)}
                      placeholder="Suggest a feature for internal review"
                    />
                  </div>
                </div>
              ) : null}

              {currentStep?.id === "technical" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Technical Integration
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      APIs, SDKs, plugins, and developer tools.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>API Documentation URL</label>
                      <input
                        type="url"
                        className={inputClass}
                        value={form.apiDocumentationUrl}
                        onChange={(e) => updateField("apiDocumentationUrl", e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>SDK Availability</label>
                      <MultiSelectChips
                        options={SDK_OPTIONS}
                        value={form.sdkAvailability}
                        onChange={(v) => updateField("sdkAvailability", v)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Plugin Availability</label>
                      <MultiSelectChips
                        options={PLUGIN_OPTIONS}
                        value={form.pluginAvailability}
                        onChange={(v) => updateField("pluginAvailability", v)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Mobile SDK Support</label>
                      <MultiSelectChips
                        options={MOBILE_SDK_OPTIONS}
                        value={form.mobileSdkSupport}
                        onChange={(v) => updateField("mobileSdkSupport", v)}
                      />
                    </div>
                    <div className="space-y-3 sm:col-span-2">
                      <ToggleField
                        id="sandbox-access"
                        label="Sandbox Access"
                        checked={form.sandboxAccess}
                        onChange={(v) => updateField("sandboxAccess", v)}
                      />
                      <ToggleField
                        id="webhook-support"
                        label="Webhook Support"
                        checked={form.webhookSupport}
                        onChange={(v) => updateField("webhookSupport", v)}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep?.id === "merchant-experience" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Merchant Experience
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      Ratings are system-calculated. You can submit success assets.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-xs text-slate-500">Merchant Rating</p>
                      <p className="mt-1 text-sm font-semibold text-[#13203F]">Auto-calculated</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-xs text-slate-500">Total Reviews</p>
                      <p className="mt-1 text-sm font-semibold text-[#13203F]">Auto-calculated</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-xs text-slate-500">CompareX Match Score</p>
                      <p className="mt-1 text-sm font-semibold text-[#13203F]">Auto-calculated</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Merchant Success Stories (URL)</label>
                      <input
                        type="url"
                        className={inputClass}
                        value={form.merchantSuccessStoriesUrl}
                        onChange={(e) => updateField("merchantSuccessStoriesUrl", e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Case Studies (URL)</label>
                      <input
                        type="url"
                        className={inputClass}
                        value={form.caseStudiesUrl}
                        onChange={(e) => updateField("caseStudiesUrl", e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {currentStep?.id === "talk-to-expert" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Talk to Expert
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      Configure expert routing for merchant consultations.
                    </p>
                  </div>
                  <ToggleField
                    id="tte-enabled"
                    label="Talk to Expert Enabled"
                    checked={form.talkToExpertEnabled}
                    onChange={(v) => updateField("talkToExpertEnabled", v)}
                  />
                  {form.talkToExpertEnabled ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Expert Name</label>
                        <input
                          className={inputClass}
                          value={form.expertName}
                          onChange={(e) => updateField("expertName", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Expert Designation</label>
                        <input
                          className={inputClass}
                          value={form.expertDesignation}
                          onChange={(e) => updateField("expertDesignation", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Expert Email</label>
                        <input
                          type="email"
                          className={inputClass}
                          value={form.expertEmail}
                          onChange={(e) => updateField("expertEmail", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Expert Mobile</label>
                        <input
                          className={inputClass}
                          inputMode="numeric"
                          maxLength={10}
                          value={form.expertMobile}
                          onChange={(e) =>
                            updateField("expertMobile", e.target.value.replace(/\D/g, "").slice(0, 10))
                          }
                          placeholder="10-digit"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Expert Description</label>
                        <textarea
                          rows={3}
                          maxLength={100}
                          className={`${inputClass} resize-y`}
                          value={form.expertDescription}
                          onChange={(e) => updateField("expertDescription", e.target.value)}
                          placeholder="Up to 100 characters"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <ToggleField
                          id="calendar-synced"
                          label="Calendar Sync with External Tool"
                          checked={form.calendarSynced}
                          onChange={(v) => updateField("calendarSynced", v)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Availability Slots</label>
                        <input
                          className={inputClass}
                          value={form.availabilitySlots}
                          onChange={(e) => updateField("availabilitySlots", e.target.value)}
                          placeholder="e.g. Mon–Fri 10:00–18:00 IST"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {currentStep?.id === "recommendation" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-[28px]">
                      Almost done
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                      Review your profile highlights, then continue to submit your onboarding form.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Service Type
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#13203F]">{selectedService}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Brand
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#13203F]">
                          {form.brandName || "—"}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Smart Tags
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedSmartTags.length > 0 ? (
                            selectedSmartTags.map((tag) => (
                              <span
                                key={tag.value}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#c7d2fe] bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#13203F]"
                              >
                                <span aria-hidden>{tag.emoji}</span>
                                {tag.label}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-500">—</span>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Features
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#13203F]">
                          {form.features.length > 0 ? form.features.join(", ") : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                        <HiMapPin className="size-4" aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#13203F]">CompareX Recommendation</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          Operators with transparent pricing, faster onboarding, and merchant-friendly
                          support generally receive higher visibility and better merchant conversion.
                        </p>
                      </div>
                    </div>
                  </div>
                  {draftSaved ? (
                    <p className="text-sm font-medium text-[#25a36f]">
                      Draft saved. You can continue whenever you&apos;re ready.
                    </p>
                  ) : null}
                  {uploadError ? (
                    <p className="text-sm font-medium text-red-600">{uploadError}</p>
                  ) : null}
                  {saveError ? (
                    <p className="text-sm font-medium text-red-600">{saveError}</p>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-5">
                {isLastStep ? (
                  <>
                    <button
                      type="button"
                      disabled={isSaving || Boolean(uploadingField)}
                      onClick={handleSaveDraft}
                      className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-200 px-5 py-3 text-sm font-bold text-[#13203F] transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Draft"}
                    </button>
                    <button
                      type="button"
                      disabled={isSaving || Boolean(uploadingField)}
                      onClick={handleSubmit}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#13203F] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1c2d52] disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ color: "#fff" }}
                    >
                      {isSaving ? "Submitting..." : "Submit for Review"}
                      <HiArrowRight className="size-4" aria-hidden />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (stepIndex === 0) {
                          handleClose();
                          return;
                        }
                        setStepIndex((s) => s - 1);
                      }}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#2D4CC8]/40"
                    >
                      <HiArrowLeft className="size-4" aria-hidden />
                      {stepIndex === 0 ? "Close" : "Back"}
                    </button>
                    <button
                      type="button"
                      disabled={!canContinue() || Boolean(uploadingField)}
                      onClick={() => setStepIndex((s) => Math.min(s + 1, visibleSteps.length - 1))}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ color: "#fff" }}
                    >
                      Next
                      <HiArrowRight className="size-4" aria-hidden />
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function OnboardingForm({ open, onClose, initialData, onSaved, persistToApi = true }) {
  return (
    <OnboardingFormModal
      open={open}
      onClose={onClose}
      initialData={initialData}
      onSaved={onSaved}
      persistToApi={persistToApi}
    />
  );
}
