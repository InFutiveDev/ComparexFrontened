"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ResellerProfileCompletionSummary } from "@/components/portal/reseller-profile-completion";
import { USER_ROLES, formatRoleLabel } from "@/lib/account-roles";
import { fetchMyResellerProfile } from "@/lib/reseller";

export default function ResellerDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchMyResellerProfile()
      .then((data) => setProfile(data.reseller))
      .catch(() => setProfile(null));
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2D4CC8]">
          {formatRoleLabel(USER_ROLES.RESELLER)} dashboard
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#13203F]">
          Welcome to your reseller portal
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Manage partner activity, complete registration, and track commissions from one dashboard.
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
            <p className="text-xs font-medium text-slate-500">Profile completion</p>
            <p className="mt-1 text-sm font-semibold text-[#25a36f]">{percent}%</p>
          </div>
        </div>
      </section>
    </div>
  );
}
