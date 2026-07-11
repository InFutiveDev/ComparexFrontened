"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { formatRoleLabel } from "@/lib/account-roles";

export function PortalHome({
  role,
  title,
  description,
  cards = [],
}) {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
    </div>
  );
}
