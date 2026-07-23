"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { PgRatingSummary } from "@/components/shared/pg-rating-summary";
import { OnboardingForm } from "@/components/portal/onboarding-form";
import { USER_ROLES, formatRoleLabel } from "@/lib/account-roles";
import { fetchMyPaymentProfile } from "@/lib/payment";

export function PortalHome({
  role,
  title,
  description,
  cards = [],
}) {
  const { user } = useAuth();
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [pgProfile, setPgProfile] = useState(null);
  const isPaymentGateway = role === USER_ROLES.PAYMENT_PROVIDER;

  useEffect(() => {
    if (!isPaymentGateway) return;

    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMyPaymentProfile();
        if (!cancelled) {
          setPgProfile(data.paymentGateway || null);
        }
      } catch {
        if (!cancelled) setPgProfile(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isPaymentGateway]);

  const completionPercent = pgProfile?.profileCompletion?.percent ?? 0;
  const verificationStatus = pgProfile?.verificationStatus || "incomplete";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {isPaymentGateway ? (
          <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl bg-[#EEF2FC] px-5 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D4CC8]">
                complete your profile
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Onboarding {completionPercent}% ·{" "}
                <span className="capitalize">
                  {String(verificationStatus).replaceAll("_", " ")}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/payment-gateway-dashboard/profile"
                className="inline-flex cursor-pointer items-center rounded-full border border-[#2D4CC8]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#2D4CC8] transition hover:border-[#2D4CC8]"
              >
                View profile
              </Link>
              {verificationStatus !== "approved" ? (
                <button
                  type="button"
                  onClick={() => setOnboardingOpen(true)}
                  className="inline-flex cursor-pointer items-center rounded-full bg-[#2D4CC8] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#2542b6]"
                  style={{ color: "#fff" }}
                >
                  {completionPercent > 0 ? "Continue Onboarding" : "Start Onboarding"}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D4CC8]">
          {formatRoleLabel(role)} dashboard
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#13203F]">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">Signed in as</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#13203F]">
              {user?.name || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">Email</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#13203F]">
              {user?.email || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">Account status</p>
            <p className="mt-1 text-sm font-semibold capitalize text-[#25a36f]">
              {user?.status || "active"}
            </p>
          </div>
        </div>

        {isPaymentGateway ? (
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Merchant ratings
            </p>
            <PgRatingSummary rating={pgProfile?.rating} compact />
          </div>
        ) : null}
      </section>

      {cards.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#2D4CC8]/30 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-[#13203F]">{card.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[#2D4CC8]">
                Open →
              </span>
            </Link>
          ))}
        </section>
      ) : null}

      {isPaymentGateway ? (
        <OnboardingForm
          open={onboardingOpen}
          onClose={() => setOnboardingOpen(false)}
          initialData={pgProfile?.onboarding || undefined}
          onSaved={(_saved, paymentGateway) => {
            if (paymentGateway) setPgProfile(paymentGateway);
          }}
        />
      ) : null}
    </div>
  );
}
