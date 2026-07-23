"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ResellerProfileCompletionSummary } from "@/components/portal/reseller-profile-completion";
import { USER_ROLES, formatRoleLabel } from "@/lib/account-roles";
import { formatInr } from "@/lib/reseller-finance-ui";
import {
  fetchMyResellerCommissions,
  fetchMyResellerGmv,
  fetchMyResellerProfile,
} from "@/lib/reseller";

export default function ResellerDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState({ totalGmv: 0, pendingCommission: 0, paidCommission: 0 });

  useEffect(() => {
    fetchMyResellerProfile()
      .then((data) => setProfile(data.reseller))
      .catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    Promise.all([
      fetchMyResellerGmv({ page: 1, limit: 1 }).catch(() => null),
      fetchMyResellerCommissions({ page: 1, limit: 1 }).catch(() => null),
    ])
      .then(([gmvData, commissionData]) => {
        setSummary({
          totalGmv: gmvData?.totalGmv || 0,
          pendingCommission: commissionData?.stats?.pending || 0,
          paidCommission: commissionData?.stats?.paid || 0,
        });
      })
      .catch(() => {
        if (process.env.NODE_ENV === "development") {
          console.warn("Reseller finance summary unavailable");
        }
      });
  }, []);

  const percent = profile?.profileCompletionPercent ?? 0;
  const incomplete = percent < 100;

  return (
    <div className="space-y-5">
      {profile ? <ResellerProfileCompletionSummary profile={profile} /> : null}

      {incomplete ? (
        <div className="rounded-2xl border border-[#2D4CC8]/20 bg-[#EEF2FC] px-5 py-4">
          <p className="text-sm font-semibold text-[#13203F]">
            Complete your registration to unlock full partner access
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Your profile is {percent}% complete. Add partnership model, KYC, and agreements so
            admin can verify your account.
          </p>
          <Link
            href="/reseller-dashboard/profile"
            className="mt-3 inline-flex text-sm font-semibold text-[#2D4CC8] hover:underline"
          >
            Continue profile →
          </Link>
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/reseller-dashboard/gmv"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#2D4CC8]/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total GMV</p>
          <p className="mt-2 text-2xl font-bold text-[#13203F]">{formatInr(summary.totalGmv)}</p>
        </Link>
        <Link
          href="/reseller-dashboard/commissions"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#2D4CC8]/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Pending commission
          </p>
          <p className="mt-2 text-2xl font-bold text-[#13203F]">
            {formatInr(summary.pendingCommission)}
          </p>
        </Link>
        <Link
          href="/reseller-dashboard/invoices"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#2D4CC8]/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Paid commission
          </p>
          <p className="mt-2 text-2xl font-bold text-[#13203F]">
            {formatInr(summary.paidCommission)}
          </p>
        </Link>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D4CC8]">
          {formatRoleLabel(USER_ROLES.RESELLER)} dashboard
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#13203F]">
          Welcome to your reseller portal
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Manage partner activity, track GMV and commissions, submit payout invoices, and complete
          KYC from one dashboard.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">Signed in as</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#13203F]">
              {user?.name || profile?.fullName || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">Email</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#13203F]">
              {user?.email || profile?.email || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">KYC status</p>
            <p className="mt-1 text-sm font-semibold text-[#25a36f]">
              {profile?.kycStatusLabel || "Incomplete"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
