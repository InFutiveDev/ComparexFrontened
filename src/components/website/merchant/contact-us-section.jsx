"use client";

import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import { useTalkToExpert } from "@/components/website/talk-to-expert/talk-to-expert-provider";

const ctaClassName =
  "group relative flex h-[calc(48px+8px)] w-full cursor-pointer items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 font-medium text-white";

function CtaButton({ href, label, onClick }) {
  const content = (
    <>
      <span className="z-10 pr-2 text-white">{label}</span>
      <div className="absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
        <div className="mr-3.5 flex items-center justify-center">
          <HiArrowRight className="size-5 text-neutral-50" />
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={ctaClassName} style={{ color: "#fff" }}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={ctaClassName} style={{ color: "#fff" }}>
      {content}
    </Link>
  );
}

export function ContactUsSection() {
  const { openTalkToExpert } = useTalkToExpert();

  return (
    <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#eff4ff] via-[#e9f2ff] to-[#ecf9f3] px-5 py-12 text-center shadow-[0_20px_60px_-30px_rgba(30,58,138,0.35)] sm:rounded-[2.5rem] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            aria-hidden
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(59,130,246,0.10) 26px, rgba(59,130,246,0.10) 27px)",
            }}
          />
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#60a5fa]/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#34d399]/20 blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto flex w-full flex-col items-center">
            <span className="inline-flex rounded-full border border-blue-200 bg-white/90 px-4 py-1.5 text-xs font-semibold tracking-tight text-blue-700 shadow-sm backdrop-blur">
              CompareX for Merchants
            </span>
            <h2 className="mt-6 text-balance text-[30px] font-bold tracking-tight text-slate-900 sm:text-[30px] lg:leading-tight">
            Find solutions that truly fit your business.

            </h2>
           

            <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <CtaButton href="/merchant/form" label="Get Recommendations" />
              <CtaButton onClick={openTalkToExpert} label="Talk to Expert" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
