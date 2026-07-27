"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiLockClosed, HiUserCircle } from "react-icons/hi2";
import { useAuth } from "@/components/auth/auth-provider";
import { PasswordInput } from "@/components/dashboard/shared/password-input";
import { ApiError } from "@/lib/api";
import { changePassword, setAuthSession, isRememberedSession } from "@/lib/auth";
import { fetchMyMerchantProfile, updateMyMerchantProfile } from "@/lib/merchant";
import { sanitizePhoneInput, validateContactFields, validateEmail } from "@/lib/validation";

const categories = [
  { value: "ecommerce-d2c", label: "Ecommerce / D2C" },
  { value: "b2b-manufacturing", label: "B2B / Manufacturing" },
  { value: "saas-subscription-platforms", label: "SaaS / Subscription Platforms" },
  { value: "education-healthcare", label: "Education / Healthcare Services" },
  { value: "travel-bill-payments", label: "Travel / Bill Payments" },
  { value: "other-businesses", label: "Freelancers / Other Businesses" },
];

const LEAD_STATUS_LABELS = {
  new: "New",
  in_review: "In Review",
  qualified: "Qualified",
  rejected: "Rejected",
  assigned: "Assigned",
  expert_booked: "Talk to Expert Booked",
};

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const labelClass = "text-sm font-semibold text-slate-600";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatVolume(value) {
  if (value == null || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function categoryLabel(value) {
  return categories.find((item) => item.value === value)?.label || value || "—";
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        {Icon ? <Icon className="size-5 text-[#2D4CC8]" aria-hidden /> : null}
        <h3 className="text-base font-bold text-[#13203F] sm:text-lg">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function StatusBadge({ status }) {
  const styles = {
    new: "bg-blue-50 text-blue-700 ring-blue-200",
    in_review: "bg-amber-50 text-amber-700 ring-amber-200",
    qualified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",
    assigned: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    expert_booked: "bg-violet-50 text-violet-700 ring-violet-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${
        styles[status] || styles.new
      }`}
    >
      {LEAD_STATUS_LABELS[status] || status || "—"}
    </span>
  );
}

export function MerchantProfileSection() {
  const { user, token, establishSession } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    businessName: "",
    contactName: "",
    phone: "",
    merchantCategory: "",
    estimatedMonthlyVolume: "",
  });
  const [lead, setLead] = useState(null);
  const [leadCount, setLeadCount] = useState(0);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const applyProfileData = useCallback((data) => {
    setLead(data.lead ?? null);
    setLeadCount(data.leadCount ?? 0);
    setProfileForm({
      name: data.user?.name || user?.name || "",
      email: data.user?.email || user?.email || "",
      businessName: data.lead?.businessName || "",
      contactName: data.lead?.contactName || data.user?.name || "",
      phone: data.lead?.phone || "",
      merchantCategory: data.lead?.merchantCategory || data.lead?.industry || "",
      estimatedMonthlyVolume:
        data.lead?.estimatedMonthlyVolume != null
          ? String(data.lead.estimatedMonthlyVolume)
          : "",
    });
  }, [user]);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await fetchMyMerchantProfile();
      applyProfileData(data);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [applyProfileData]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function updateProfileField(key, value) {
    setProfileForm((current) => ({ ...current, [key]: value }));
  }

  function updatePasswordField(key, value) {
    setPasswordForm((current) => ({ ...current, [key]: value }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");

    const contactError = lead
      ? validateContactFields({
          email: profileForm.email,
          phone: profileForm.phone,
        })
      : validateEmail(profileForm.email);
    if (contactError) {
      setProfileError(contactError);
      return;
    }

    if (lead && Number(profileForm.estimatedMonthlyVolume) <= 0) {
      setProfileError("Estimated monthly volume must be greater than zero");
      return;
    }

    setIsSavingProfile(true);

    try {
      const payload = {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
      };

      if (lead) {
        payload.businessName = profileForm.businessName.trim();
        payload.contactName = profileForm.contactName.trim();
        payload.phone = profileForm.phone;
        payload.merchantCategory = profileForm.merchantCategory;
        payload.estimatedMonthlyVolume = Number(profileForm.estimatedMonthlyVolume);
      }

      const result = await updateMyMerchantProfile(payload);
      applyProfileData(result);

      if (result.user && token) {
        establishSession(
          {
            token,
            user: result.user,
          },
          isRememberedSession(),
        );
      }

      setProfileMessage(result.message || "Profile updated successfully");
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }

    setIsSavingPassword(true);

    try {
      const result = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage(result.message || "Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Failed to update password");
    } finally {
      setIsSavingPassword(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Loading profile…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-4 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm text-red-700">{loadError}</p>
        <button
          type="button"
          onClick={loadProfile}
          className="cursor-pointer rounded-full bg-[#2D4CC8] px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Account status</p>
          <p className="mt-1 text-lg font-bold capitalize text-[#13203F]">
            {user?.status || "active"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Leads submitted</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{leadCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Latest lead status</p>
          <div className="mt-2">
            {lead ? <StatusBadge status={lead.leadStatus} /> : <span className="text-sm text-slate-500">No lead yet</span>}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Assigned PG</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">
            {lead?.assignedPgName || "Not assigned"}
          </p>
        </div>
      </div>

      {profileMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {profileMessage}
        </div>
      ) : null}

      {profileError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {profileError}
        </div>
      ) : null}

      <SectionCard title="Account details" icon={HiUserCircle}>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="merchant-profile-name" className={labelClass}>
                Full name
              </label>
              <input
                id="merchant-profile-name"
                className={inputClass}
                value={profileForm.name}
                onChange={(event) => updateProfileField("name", event.target.value)}
                required
                disabled={isSavingProfile}
              />
            </div>
            <div>
              <label htmlFor="merchant-profile-email" className={labelClass}>
                Email address
              </label>
              <input
                id="merchant-profile-email"
                type="email"
                className={inputClass}
                value={profileForm.email}
                onChange={(event) => updateProfileField("email", event.target.value)}
                required
                disabled={isSavingProfile}
              />
            </div>
          </div>

          {lead ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="merchant-profile-business" className={labelClass}>
                    Business name
                  </label>
                  <input
                    id="merchant-profile-business"
                    className={inputClass}
                    value={profileForm.businessName}
                    onChange={(event) => updateProfileField("businessName", event.target.value)}
                    required
                    disabled={isSavingProfile}
                  />
                </div>
                <div>
                  <label htmlFor="merchant-profile-contact" className={labelClass}>
                    Contact name
                  </label>
                  <input
                    id="merchant-profile-contact"
                    className={inputClass}
                    value={profileForm.contactName}
                    onChange={(event) => updateProfileField("contactName", event.target.value)}
                    required
                    disabled={isSavingProfile}
                  />
                </div>
                <div>
                  <label htmlFor="merchant-profile-phone" className={labelClass}>
                    Phone number
                  </label>
                  <input
                    id="merchant-profile-phone"
                    className={inputClass}
                    value={profileForm.phone}
                    onChange={(event) =>
                      updateProfileField("phone", sanitizePhoneInput(event.target.value))
                    }
                    required
                    disabled={isSavingProfile}
                  />
                </div>
                <div>
                  <label htmlFor="merchant-profile-category" className={labelClass}>
                    Merchant category
                  </label>
                  <select
                    id="merchant-profile-category"
                    className={inputClass}
                    value={profileForm.merchantCategory}
                    onChange={(event) => updateProfileField("merchantCategory", event.target.value)}
                    required
                    disabled={isSavingProfile}
                  >
                    <option value="">Select category</option>
                    {categories.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="merchant-profile-volume" className={labelClass}>
                    Estimated monthly volume (INR)
                  </label>
                  <input
                    id="merchant-profile-volume"
                    type="number"
                    min="1"
                    className={inputClass}
                    value={profileForm.estimatedMonthlyVolume}
                    onChange={(event) =>
                      updateProfileField("estimatedMonthlyVolume", event.target.value)
                    }
                    required
                    disabled={isSavingProfile}
                  />
                </div>
              </div>

              <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">Latest lead submitted</p>
                  <p className="mt-1 text-sm font-semibold text-[#13203F]">
                    {formatDate(lead.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Current volume on file</p>
                  <p className="mt-1 text-sm font-semibold text-[#13203F]">
                    {formatVolume(lead.estimatedMonthlyVolume)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Category</p>
                  <p className="mt-1 text-sm font-semibold text-[#13203F]">
                    {categoryLabel(lead.merchantCategory || lead.industry)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Lead source</p>
                  <p className="mt-1 text-sm font-semibold text-[#13203F]">
                    {lead.source || "—"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              You have not submitted a merchant lead yet.{" "}
              <Link href="/merchant-dashboard/submit-lead" className="font-semibold text-[#2D4CC8] hover:underline">
                Submit a lead
              </Link>{" "}
              to add business details to your profile.
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="cursor-pointer rounded-full bg-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243da8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingProfile ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Change password" icon={HiLockClosed}>
        {passwordMessage ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {passwordMessage}
          </div>
        ) : null}

        {passwordError ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {passwordError}
          </div>
        ) : null}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="merchant-current-password" className={labelClass}>
              Current password
            </label>
            <PasswordInput
              id="merchant-current-password"
              value={passwordForm.currentPassword}
              onChange={(value) => updatePasswordField("currentPassword", value)}
              required
              disabled={isSavingPassword}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="merchant-new-password" className={labelClass}>
                New password
              </label>
              <PasswordInput
                id="merchant-new-password"
                value={passwordForm.newPassword}
                onChange={(value) => updatePasswordField("newPassword", value)}
                required
                minLength={8}
                disabled={isSavingPassword}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="merchant-confirm-password" className={labelClass}>
                Confirm new password
              </label>
              <PasswordInput
                id="merchant-confirm-password"
                value={passwordForm.confirmPassword}
                onChange={(value) => updatePasswordField("confirmPassword", value)}
                required
                minLength={8}
                disabled={isSavingPassword}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="cursor-pointer rounded-full bg-[#13203F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f1833] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingPassword ? "Updating…" : "Update password"}
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
