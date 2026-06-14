"use client";

import Link from "next/link";
import {
  HiArrowRight,
  HiBuildingStorefront,
  HiCreditCard,
  HiUserGroup,
} from "react-icons/hi2";

const roleOptions = [
  {
    id: "merchant",
    title: "Merchant",
    description:
      "Find and compare payment gateways suited to your business — free, unbiased, and expert-guided.",
    href: "/merchant",
    cta: "Explore as Merchant",
    Icon: HiBuildingStorefront,
    accent: "border-[#25A36F]/20 hover:border-[#25A36F]/40",
    iconBg: "bg-[#ECFDF5] text-[#25A36F]",
    dot: "bg-[#25A36F]",
  },
  {
    id: "reseller",
    title: "Reseller / Partner",
    description:
      "Refer merchant leads, track activations, and earn commissions through one trusted platform.",
    href: "/reseller",
    cta: "Join as Partner",
    Icon: HiUserGroup,
    accent: "border-[#2D4CC8]/20 hover:border-[#2D4CC8]/40",
    iconBg: "bg-[#EEF2FC] text-[#2D4CC8]",
    dot: "bg-[#2D4CC8]",
  },
  {
    id: "payment",
    title: "Payment Provider (PA / PG)",
    description:
      "List your payment gateway, reach high-intent merchants, and grow through CompareX marketplace.",
    href: "/payment",
    cta: "List Your PG",
    Icon: HiCreditCard,
    accent: "border-[#0891b2]/20 hover:border-[#0891b2]/40",
    iconBg: "bg-[#ecfeff] text-[#0891b2]",
    dot: "bg-[#0891b2]",
  },
];

export function RoleCardsSection() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#eff4ff] via-[#e9f2ff] to-[#ecf9f3]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(59,130,246,0.10) 26px, rgba(59,130,246,0.10) 27px)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-blue-200 bg-white/90 px-4 py-1.5 text-xs font-semibold tracking-tight text-blue-700 shadow-sm backdrop-blur">
            Get Started
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How would you like to use CompareX?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Choose your path below. Whether you&apos;re a business, partner, or payment provider —
            CompareX has a tailored experience for you.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roleOptions.map((role) => {
            const RoleIcon = role.Icon;

            return (
              <Link
                key={role.id}
                href={role.href}
                className={`group flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${role.accent}`}
              >
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl ${role.iconBg}`}
                >
                  <RoleIcon className="size-6" aria-hidden />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900">{role.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {role.description}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2D4CC8] transition group-hover:gap-3">
                  <span className={`size-1.5 rounded-full ${role.dot}`} aria-hidden />
                  {role.cta}
                  <HiArrowRight className="size-4" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#2D4CC8] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
