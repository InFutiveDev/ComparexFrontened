import Link from "next/link";
import {
  HiArrowRight,
  HiChartBarSquare,
  HiCheck,
  HiCurrencyRupee,
  HiShieldCheck,
  HiSparkles,
  HiUserGroup,
  HiXMark,
} from "react-icons/hi2";

const differentiators = [
  {
    title: "Truly unbiased",
    description:
      "We don't push one provider — we help you compare all options fairly based on your business needs.",
    Icon: HiShieldCheck,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
  },
  {
    title: "Save weeks of research",
    description:
      "Pricing, settlement, integrations, and onboarding — compared in one place instead of ten websites.",
    Icon: HiSparkles,
    accent: "text-[#25A36F]",
    iconBg: "bg-[#ECFDF5]",
  },
  {
    title: "Expert guidance included",
    description:
      "Talk to payment specialists who shortlist gateways for your industry, volume, and growth plans.",
    Icon: HiUserGroup,
    accent: "text-[#0891b2]",
    iconBg: "bg-[#ecfeff]",
  },
  {
    title: "Better pricing access",
    description:
      "Leverage CompareX partner network for competitive rates and offers you may not find on your own.",
    Icon: HiCurrencyRupee,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
  },
];

const comparisonRows = [
  {
    feature: "Unbiased payment gateway comparisons",
    comparex: "yes",
    alone: "no",
    sales: "no",
  },
  {
    feature: "Side-by-side pricing & settlement view",
    comparex: "yes",
    alone: "partial",
    sales: "partial",
  },
  {
    feature: "Real merchant reviews & ratings",
    comparex: "yes",
    alone: "partial",
    sales: "no",
  },
  {
    feature: "Expert guidance at no cost",
    comparex: "yes",
    alone: "no",
    sales: "no",
  },
  {
    feature: "Onboarding & activation support",
    comparex: "yes",
    alone: "no",
    sales: "partial",
  },
  {
    feature: "Time to shortlist providers",
    comparex: "Minutes",
    alone: "Weeks",
    sales: "Slow",
    isText: true,
  },
];

function CellValue({ value, highlight = false }) {
  if (value === "yes") {
    return (
      <span
        className={`inline-flex size-8 items-center justify-center rounded-full ${
          highlight ? "bg-[#25A36F]" : "bg-[#ECFDF5]"
        }`}
      >
        <HiCheck className={`size-4 ${highlight ? "text-white" : "text-[#25A36F]"}`} aria-hidden />
      </span>
    );
  }

  if (value === "no") {
    return (
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-slate-100">
        <HiXMark className="size-4 text-slate-400" aria-hidden />
      </span>
    );
  }

  if (value === "partial") {
    return <span className="text-sm font-medium text-amber-600">Limited</span>;
  }

  return (
    <span className={`text-sm font-semibold ${highlight ? "text-[#2D4CC8]" : "text-slate-600"}`}>
      {value}
    </span>
  );
}

export default function WhyCompareXSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
            The CompareX Advantage
          </span>
          <h2 className="mt-5 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            Why businesses trust{" "}
            <em className="italic text-slate-800">CompareX</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            See how CompareX stacks up against researching on your own or relying only on provider
            sales conversations.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)]">
          <div className="hidden md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-[#f8fafc]">
                  <th className="px-6 py-5 text-sm font-semibold text-slate-700">What you get</th>
                  <th className="bg-[#EEF2FC] px-6 py-5 text-center text-sm font-bold text-[#2D4CC8]">
                    CompareX
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-slate-600">
                    On your own
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-slate-600">
                    Sales pitches
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-800 sm:text-base">
                      {row.feature}
                    </td>
                    <td className="bg-[#EEF2FC]/50 px-6 py-4 text-center">
                      <CellValue value={row.comparex} highlight />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CellValue value={row.alone} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CellValue value={row.sales} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-200 md:hidden">
            {comparisonRows.map((row) => (
              <div key={row.feature} className="p-5">
                <p className="text-sm font-semibold text-slate-900">{row.feature}</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-[#EEF2FC] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#2D4CC8]">
                      CompareX
                    </p>
                    <div className="mt-2 flex justify-center">
                      <CellValue value={row.comparex} highlight />
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Alone
                    </p>
                    <div className="mt-2 flex justify-center">
                      <CellValue value={row.alone} />
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Sales
                    </p>
                    <div className="mt-2 flex justify-center">
                      <CellValue value={row.sales} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map(({ title, description, Icon, accent, iconBg }) => (
            <li
              key={title}
              className="rounded-2xl border border-slate-200 bg-[#fafbf9] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`flex size-11 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className={`size-5 ${accent}`} aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#2D4CC8]/15 bg-gradient-to-br from-[#EEF2FC] via-white to-[#ECFDF5] px-6 py-8 text-center sm:flex-row sm:text-left sm:px-10">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#2D4CC8]">
              <HiChartBarSquare className="size-6 text-white" aria-hidden />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Ready to compare payment gateways?
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 sm:text-base">
                Start with a free, unbiased comparison tailored to your business.
              </p>
            </div>
          </div>
          <Link
            href="/merchant"
            className="group relative inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 text-sm font-medium text-white transition hover:bg-[#3B5BDB]"
            style={{ color: "#fff" }}
          >
            <span className="z-10 pr-2 text-white">Compare Gateways</span>
            <span className="absolute right-1 inline-flex h-10 w-10 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
              <span className="mr-3 flex items-center justify-center">
                <HiArrowRight className="size-5 text-white" aria-hidden />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
