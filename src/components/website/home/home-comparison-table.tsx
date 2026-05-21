"use client";

import {
  HiOutlineChevronUpDown,
  HiOutlineHeart,
} from "react-icons/hi2";

const firms = [
  {
    name: "FundingPips",
    logo: "FP",
    payoutMode: "Bi-Weekly",
    settlement: "2 Days",
    onboarding: "Instant",
    providers: "Rise / Deel",
    supported: "UPI, Bank",
    offers: "20% OFF",
    review: "4.8",
    reviewCount: 868,
    trust: "9.2",
    apps: "Web + App",
    rowClass: "bg-gradient-to-r from-[#eef3ff] via-white to-white",
  },
  {
    name: "The5ers",
    logo: "T5",
    payoutMode: "Weekly",
    settlement: "1 Day",
    onboarding: "Fast",
    providers: "Wise",
    supported: "Crypto",
    offers: "10% OFF",
    review: "4.7",
    reviewCount: 1177,
    trust: "9.0",
    apps: "Web",
    rowClass: "bg-gradient-to-r from-slate-50 via-white to-white",
  },
  {
    name: "Goat Funded",
    logo: "GF",
    payoutMode: "14 Days",
    settlement: "3 Days",
    onboarding: "Easy",
    providers: "Rise",
    supported: "UPI",
    offers: "50% OFF",
    review: "4.5",
    reviewCount: 1060,
    trust: "8.8",
    apps: "Web + iOS",
    rowClass: "bg-gradient-to-r from-[#ecfbfc] via-white to-white",
  },
];

const paymentModes = [
  "UPI",
  "Debit Card",
  "Credit Card",
  "Net Banking",
  "Wallet",
  "GPay",
  "PayLater",
  "International",
];

const tableColumns = [
  { label: "Firm", sortable: true },
  { label: "Best for", sortable: true },
  { label: "PG Mode", sortable: true },
  { label: "Settlement Cycle", sortable: true },
  { label: "Onboarding TAT", sortable: true },
  { label: "Providers", sortable: true },
  { label: "Supported Picker", sortable: false },
  { label: "Offers", sortable: true },
  { label: "Review", sortable: true },
  { label: "T.T Score", sortable: true },
  { label: "Apps", sortable: false },
  
] as const;

const thClass =
  "whitespace-nowrap px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";

const tdClass = "border-t border-slate-200 px-4 py-5 align-middle";

function FirmReview({
  rating,
  reviewCount,
}: {
  rating: string;
  reviewCount: number;
}) {
  const value = Number.parseFloat(rating);
  const fullStars = Math.floor(value);
  const fraction = Math.min(1, Math.max(0, value - fullStars));

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] p-px">
        <div className="rounded-full bg-white px-4 py-0.5">
          <span className="text-sm font-bold leading-none text-[#13203F]">{rating}</span>
        </div>
      </div>

      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => {
          const starIndex = index + 1;
          if (starIndex <= fullStars) {
            return (
              <span key={starIndex} className="text-base leading-none text-[#2D4CC8]">
                ★
              </span>
            );
          }
          if (starIndex === fullStars + 1 && fraction > 0) {
            return (
              <span key={starIndex} className="relative inline-block text-base leading-none">
                <span className="text-slate-300">★</span>
                <span
                  className="absolute left-0 top-0 overflow-hidden text-[#2D4CC8]"
                  style={{ width: `${fraction * 100}%` }}
                >
                  ★
                </span>
              </span>
            );
          }
          return (
            <span key={starIndex} className="text-base leading-none text-slate-300">
              ★
            </span>
          );
        })}
      </div>

      <p className="text-xs sm:text-sm">
        <span className="font-semibold text-[#2D4CC8]">{reviewCount}</span>{" "}
        <span className="text-slate-500">reviews</span>
      </p>
    </div>
  );
}

function TableHeaderCell({
  label,
  sortable,
}: {
  label: string;
  sortable: boolean;
}) {
  return (
    <th scope="col" className={thClass}>
      <span className="inline-flex items-center gap-1">
        {label}
        {sortable && (
          <HiOutlineChevronUpDown className="text-sm text-slate-400" aria-hidden />
        )}
      </span>
    </th>
  );
}

export function HomeComparisonTable() {
  return (
    <section className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-6 max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-[#13203F] sm:text-3xl">
          Compare payment & payout options
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Filter by payment mode and compare firms side by side.
        </p>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Top filter — fixed, does not scroll */}
        <div className="shrink-0 border-b border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="mr-2 text-base font-bold text-[#13203F]">Payment Mode</h3>

          {paymentModes.map((mode, index) => (
            <button
              key={mode}
              type="button"
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                index === 0
                  ? "border-[#2D4CC8] bg-[#2D4CC8]/10 text-[#2D4CC8]"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[#2D4CC8] hover:text-[#2D4CC8]"
              }`}
            >
              {mode}
            </button>
          ))}

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-[#2D4CC8] bg-[#2D4CC8] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2542b6]"
            >
              Compare Mode
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-[#2D4CC8] hover:text-[#2D4CC8]"
            >
              Sort By
            </button>
          </div>
          </div>
        </div>

        {/* Table only — horizontal scroll */}
        <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead className="border-b border-slate-200 bg-[#f4f6fc]">
            <tr>
              {tableColumns.map((col) => (
                <TableHeaderCell
                  key={col.label}
                  label={col.label}
                  sortable={col.sortable}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {firms.map((firm) => (
              <tr
                key={firm.name}
                className={`transition hover:bg-slate-50/50 ${firm.rowClass}`}
              >
                <td className={tdClass}>
                  <div className="flex min-w-[200px] items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#2D4CC8] bg-[#13203F] text-lg font-bold text-white">
                      {firm.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                          {firm.name}
                        </h3>
                        <HiOutlineHeart
                          className="text-lg text-[#2D4CC8]"
                          aria-hidden
                        />
                      </div>
                      <p className="mt-1 text-sm font-medium text-[#2D4CC8]">
                        48K Likes
                      </p>
                    </div>
                  </div>
                </td>

                <td className={tdClass}>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 sm:text-sm">
                    {firm.payoutMode}
                  </span>
                </td>

                <td className={tdClass}>
                  <span className="text-sm font-semibold text-slate-900">
                    {firm.settlement}
                  </span>
                </td>

                <td className={tdClass}>
                  <span className="text-sm font-semibold text-slate-900">
                    {firm.onboarding}
                  </span>
                </td>

                <td className={tdClass}>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 sm:text-sm">
                    {firm.providers}
                  </span>
                </td>

                <td className={tdClass}>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#222118] px-3 py-1.5 text-xs font-medium text-white/90">
                      {firm.supported}
                    </span>
                  </div>
                </td>

                <td className={tdClass}>
                  <div className="w-fit overflow-hidden rounded-xl border border-[#2D4CC8]/30">
                    <div className="bg-[#2D4CC8] px-4 py-1 text-center text-xs font-bold text-white sm:text-sm">
                      {firm.offers}
                    </div>
                    <div className="bg-[#13203F] px-4 py-1 text-center text-xs font-semibold text-white">
                      MATCH
                    </div>
                  </div>
                </td>

                <td className={`${tdClass} text-center`}>
                  <FirmReview rating={firm.review} reviewCount={firm.reviewCount} />
                </td>

                <td className={tdClass}>
                  <span className="text-base font-bold text-[#2D4CC8]">
                    {firm.trust}
                  </span>
                </td>

                <td className={tdClass}>
                  <button
                    type="button"
                    className="whitespace-nowrap rounded-full border border-[#2D4CC8] px-5 py-2 text-sm font-semibold text-[#2D4CC8] transition hover:bg-[#2D4CC8] hover:text-white"
                  >
                    {firm.apps}
                  </button>
                </td>

                <td className={tdClass}>
                  <button
                    type="button"
                    className="whitespace-nowrap rounded-full border border-[#2D4CC8] px-5 py-2 text-sm font-semibold text-[#2D4CC8] transition hover:bg-[#2D4CC8] hover:text-white"
                  >
                    {firm.apps}
                  </button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Bottom compare bar — fixed, does not scroll */}
        <div className="shrink-0 border-t border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-base font-bold text-[#13203F]">Comparing</h3>

            {["PG1", "PG2", "PG3"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-[#2D4CC8] bg-[#2D4CC8]/5 px-6 py-2 text-sm font-semibold text-[#2D4CC8]"
              >
                {chip}
              </span>
            ))}

            <button
              type="button"
              className="ml-auto rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300"
            >
              Clear
            </button>
            <button
              type="button"
              className="rounded-xl bg-[#2D4CC8] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#2542b6]"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
