"use client";

import Image from "next/image";
import React, { useState } from "react";
import { HiOutlineHeart, HiOutlineClipboardCopy } from "react-icons/hi";
import { HiOutlineChevronUpDown } from "react-icons/hi2";

/** Site accent — matches hero / features (blue + cyan), promos use orange */
const ACCENT = "#2d4cc8";
const ACCENT_MUTED = "#40c3cf";

type Row = {
  rank: number;
  name: string;
  likes: number;
  rating: number;
  reviews: number;
  countryCode: string;
  flag: string;
  yearsLabel: string;
  yearsProgress: number;
  assets: string[];
  platforms: { label: string; abbr: string }[];
  maxAllocation: string;
  allocationProgress: number;
  promoTitle: string;
  promoCode: string;
};

const rows: Row[] = [
  {
    rank: 1,
    name: "Goat Funded Trader",
    likes: 42346,
    rating: 4.3,
    reviews: 818,
    countryCode: "HK",
    flag: "🇭🇰",
    yearsLabel: "2",
    yearsProgress: 0.35,
    assets: ["Crypto", "Energy", "FX", "Indices", "Metals"],
    platforms: [
      { label: "MetaTrader 4", abbr: "4" },
      { label: "MetaTrader 5", abbr: "5" },
      { label: "cTrader", abbr: "cT" },
    ],
    maxAllocation: "$400K",
    allocationProgress: 0.72,
    promoTitle: "40% OFF",
    promoCode: "MATCH",
  },
  {
    rank: 2,
    name: "Alpha Desk",
    likes: 28901,
    rating: 4.6,
    reviews: 412,
    countryCode: "AE",
    flag: "🇦🇪",
    yearsLabel: "10+",
    yearsProgress: 1,
    assets: ["FX", "Indices", "Metals"],
    platforms: [
      { label: "MetaTrader 5", abbr: "5" },
      { label: "cTrader", abbr: "cT" },
    ],
    maxAllocation: "$250K",
    allocationProgress: 0.55,
    promoTitle: "BOGO",
    promoCode: "ALPHA2026",
  },
  {
    rank: 3,
    name: "Summit Markets",
    likes: 15622,
    rating: 4.1,
    reviews: 205,
    countryCode: "GB",
    flag: "🇬🇧",
    yearsLabel: "5",
    yearsProgress: 0.55,
    assets: ["Crypto", "FX", "Energy"],
    platforms: [{ label: "MetaTrader 4", abbr: "4" }],
    maxAllocation: "$600K",
    allocationProgress: 0.88,
    promoTitle: "25% OFF",
    promoCode: "SUMMIT",
  },
  {
    rank: 4,
    name: "River Trade Co.",
    likes: 8934,
    rating: 3.9,
    reviews: 156,
    countryCode: "US",
    flag: "🇺🇸",
    yearsLabel: "3",
    yearsProgress: 0.45,
    assets: ["Indices", "Metals", "FX"],
    platforms: [
      { label: "MetaTrader 5", abbr: "5" },
      { label: "cTrader", abbr: "cT" },
    ],
    maxAllocation: "$150K",
    allocationProgress: 0.4,
    promoTitle: "15% OFF",
    promoCode: "RIVER15",
  },
];

function SortLabel({
  children,
  sortable,
}: {
  children: React.ReactNode;
  sortable?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
      {children}
      {sortable ? (
        <HiOutlineChevronUpDown className="size-3.5 shrink-0 text-slate-600" aria-hidden />
      ) : null}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-lg shadow-inner"
        title="1st"
      >
        🏆
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-300 to-slate-500 text-lg shadow-inner"
        title="2nd"
      >
        🏆
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-amber-900 text-lg shadow-inner"
        title="3rd"
      >
        🏆
      </span>
    );
  }
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-white">
      {rank}
    </span>
  );
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.min(5, Math.round(rating));
  const empty = 5 - full;
  return (
    <div className="flex gap-0.5 text-[13px] leading-none" aria-hidden>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`} style={{ color: ACCENT }}>
          ★
        </span>
      ))}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} className="text-slate-600">
          ★
        </span>
      ))}
    </div>
  );
}

function YearsRing({ progress, label }: { progress: number; label: string }) {
  const size = 44;
  const stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - Math.min(progress, 1));
  return (
    <div className="relative flex size-11 items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(51 65 85)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ACCENT}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={dash}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset]"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-white">{label}</span>
    </div>
  );
}

export const HomeComparisonTable = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  /** Sirf column beech — `border-r` (aakhri column par nahi) */
  const colR = "border-r border-slate-600";

  const rowCell =
    "bg-[#eef2fa] backdrop-blur-2xl px-3 py-4 align-middle transition-colors group-hover:bg-slate-200/60";
  const rowCellFirst = `${rowCell} ${colR} rounded-l-2xl`;
  const rowCellMid = `${rowCell} ${colR}`;
  const rowCellLast = `${rowCell} rounded-r-2xl`;

  return (
    <section className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white px-4 py-6 shadow-xl shadow-slate-200/30 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            PG Comparison
          </h2>
          <button
            type="button"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[1040px] border-separate border-spacing-x-0 border-spacing-y-3">
            <caption className="sr-only">Prop firm comparison — firms, ratings, country, tenure, assets, platforms</caption>
            <thead>
              <tr>
                <th scope="col" className={`min-w-[220px] pb-2 pe-3 text-start align-bottom ${colR}`}>
                  <SortLabel sortable>Firm</SortLabel>
                </th>
                <th scope="col" className={`min-w-[130px] pb-2 pe-3 text-center align-bottom ${colR}`}>
                  <SortLabel sortable>Rank / Reviews</SortLabel>
                </th>
                <th scope="col" className={`min-w-[72px] pb-2 pe-3 text-center align-bottom ${colR}`}>
                  <SortLabel sortable>Country</SortLabel>
                </th>
                <th scope="col" className={`min-w-[88px] pb-2 pe-3 text-center align-bottom ${colR}`}>
                  <SortLabel sortable>Years in operation</SortLabel>
                </th>
                <th scope="col" className={`min-w-[168px] pb-2 pe-3 text-center align-bottom ${colR}`}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Assets
                  </span>
                </th>
                <th scope="col" className={`min-w-[96px] pb-2 pe-3 text-center align-bottom ${colR}`}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Platforms
                  </span>
                </th>
                <th scope="col" className={`min-w-[112px] pb-2 pe-3 text-center align-bottom ${colR}`}>
                  <SortLabel sortable>Max allocations</SortLabel>
                </th>
                <th scope="col" className={`min-w-[136px] pb-2 pe-3 text-start align-bottom ${colR}`}>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Promo
                  </span>
                </th>
                <th scope="col" className="min-w-[88px] pb-2 pe-3 text-start align-bottom">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="group">
                  <td className={rowCellFirst}>
                    <div className="flex min-w-0 items-center gap-3">
                      <RankBadge rank={row.rank} />
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-lg border border-slate-600 bg-slate-800">
                          <Image
                            src="/images/brand-1.svg"
                            alt=""
                            fill
                            className="object-contain p-1.5"
                            sizes="44px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{row.name}</p>
                          <p
                            className="mt-0.5 flex items-center gap-1 text-xs font-medium"
                            style={{ color: ACCENT }}
                          >
                            <HiOutlineHeart className="size-3.5 shrink-0" aria-hidden />
                            {row.likes.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={rowCellMid}>
                    <div className="flex flex-col items-start gap-1">
                      <span
                            className="rounded-full border px-2.5 py-0.5 text-sm font-semibold text-slate-900 shadow-[0_0_0_1px_rgba(45,76,200,0.35)]"
                        style={{
                          borderColor: `${ACCENT}66`,
                          boxShadow: `0 0 12px ${ACCENT}22`,
                        }}
                      >
                        {row.rating.toFixed(1)}
                      </span>
                      <StarRow rating={row.rating} />
                      <span className="text-xs font-medium text-slate-500">
                        {row.reviews} reviews
                      </span>
                    </div>
                  </td>
                  <td className={rowCellMid}>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                      <span className="text-lg leading-none" aria-hidden>
                        {row.flag}
                      </span>
                      {row.countryCode}
                    </div>
                  </td>
                  <td className={rowCellMid}>
                    <YearsRing progress={row.yearsProgress} label={row.yearsLabel} />
                  </td>
                  <td className={rowCellMid}>
                    <div className="flex flex-wrap gap-1">
                      {row.assets.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={rowCellMid}>
                    <div className="flex flex-wrap gap-1.5">
                      {row.platforms.map((p) => (
                        <span
                          key={p.label}
                          title={p.label}
                          className="flex size-8 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-[10px] font-bold text-slate-200"
                        >
                          {p.abbr}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={rowCellMid}>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{row.maxAllocation}</p>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.round(row.allocationProgress * 100)}%`,
                            background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_MUTED})`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className={rowCellMid}>
                    <div className="flex max-w-[140px] flex-col overflow-hidden rounded-lg border border-slate-700/80">
                      <div
                        className="px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-slate-900"
                        style={{
                          background: `linear-gradient(135deg, #FF944D 0%, ${ACCENT} 100%)`,
                        }}
                      >
                        {row.promoTitle}
                      </div>
                      <button
                        type="button"
                        onClick={() => copyCode(row.promoCode)}
                        className="flex items-center justify-center gap-1 bg-slate-100 px-2 py-1.5 text-[11px] font-semibold text-slate-900 transition hover:bg-slate-900"
                      >
                        {copied === row.promoCode ? "Copied" : row.promoCode}
                        <HiOutlineClipboardCopy className="size-3.5 opacity-80" aria-hidden />
                      </button>
                    </div>
                  </td>
                  <td className={rowCellLast}>
                    <button
                      type="button"
                      className="rounded-full border px-4 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-white/5"
                      style={{ borderColor: `${ACCENT}99` }}
                    >
                      Firm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
