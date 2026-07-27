"use client";

import { useState } from "react";
import { HiLockClosed } from "react-icons/hi2";
import { PasswordInput } from "@/components/dashboard/shared/password-input";
import { InfoCard } from "@/components/dashboard/shared/record-details";
import { ApiError } from "@/lib/api";
import { updateMerchantPassword } from "@/lib/dashboard-api";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#13203F] outline-none transition focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-600";

export function MerchantLoginPasswordSection({ merchantId, email, userId, onUpdated }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirmation do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateMerchantPassword(merchantId, password);
      setMessage(
        result.message ||
          "Merchant login password updated. Share the new password with the merchant securely.",
      );
      setPassword("");
      setConfirmPassword("");
      onUpdated?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update merchant password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <InfoCard title="Merchant login password" icon={HiLockClosed}>
      <p className="mb-4 text-sm text-slate-600">
        {userId
          ? "Set a new password so this merchant can sign in to the merchant portal."
          : "This lead does not have a login account yet. Setting a password will create one using the merchant email below."}
      </p>

      <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <span className="font-medium text-[#13203F]">Login email:</span> {email || "—"}
      </div>

      {message ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="merchant-admin-password" className={labelClass}>
              New password
            </label>
            <PasswordInput
              id="merchant-admin-password"
              value={password}
              onChange={setPassword}
              required
              minLength={8}
              disabled={isSubmitting || !email}
              placeholder="Minimum 8 characters"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="merchant-admin-confirm-password" className={labelClass}>
              Confirm password
            </label>
            <PasswordInput
              id="merchant-admin-confirm-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              minLength={8}
              disabled={isSubmitting || !email}
              placeholder="Re-enter password"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="cursor-pointer rounded-full bg-[#13203F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f1833] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : userId ? "Update password" : "Create login & set password"}
          </button>
        </div>
      </form>
    </InfoCard>
  );
}
