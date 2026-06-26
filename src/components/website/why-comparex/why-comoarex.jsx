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

const ecosystemRows = [
  {
    stakeholder: "For Businesses (Merchants)",
    delivers:
      "Access transparent comparisons, expert guidance, and tailored recommendations – so you choose the right PG the first time.",
  },
  {
    stakeholder: "For Partners (Resellers)",
    delivers:
      "Help clients make confident payment decisions - while participating in a structured referral program designed for long-term mutual growth.",
  },
  {
    stakeholder: "For Providers (PGs)",
    delivers:
      "Increase visibility among high-intent merchants actively comparing solutions - not just browsing. Reduce CAC, increase conversion.",
  },
];

const differentiators = [
  {
    title: "Truly Independent",
    description:
      "Evaluate options from multiple providers in one place – based on your business needs, not sales pitches.",
    Icon: HiShieldCheck,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
  },
  {
    title: "Reduce Research Effort",
    description:
      "Skip the endless tabs. Compare providers, capabilities, and considerations side-by-side in one unified view.",
    Icon: HiSparkles,
    accent: "text-[#25A36F]",
    iconBg: "bg-[#ECFDF5]",
  },
  {
    title: "Compare What Matters to You",
    description:
      "Filter, sort, and weigh PGs based on your unique priorities – whether it's lowest MDR, fastest settlement, or best plugin support.",
    Icon: HiUserGroup,
    accent: "text-[#0891b2]",
    iconBg: "bg-[#ecfeff]",
  },
  {
    title: "Talk to an Expert",
    description:
      "Connect with experienced payment professionals to clarify onboarding, integration, capabilities, and solution-specific questions.",
    Icon: HiCurrencyRupee,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
  },
];

const comparisonRows = [
  {
    feature: "Explore multiple solutions in one place",
    comparex: "yes",
    alone: "limited",
    sales: "no",
  },
  {
    feature: "Compare key decision factors side-by-side",
    comparex: "yes",
    alone: "Time-intensive",
    sales: "Provider-specific",
  },
  {
    feature: "Access to structured provider information",
    comparex: "yes",
    alone: "Partial",
    sales: "limited",
  },
  {
    feature: "Access educational resources & insights",
    comparex: "yes",
    alone: "limited",
    sales: "Provider-specific",
  },
  {
    feature: "Expert guidance when needed",
    comparex: "yes",
    alone: "no",
    sales: "Provider-specific",
  },
  {
    feature: "Time required to evaluate options",
    comparex: "Minutes",
    alone: "Days / Weeks",
    sales: "Multiple Conversations",
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

  if (value === "partial" || value === "limited") {
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
          Why Businesses Start Their Search with {" "}
            <em className="italic text-slate-800">CompareX</em>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          CompareX helps businesses navigate payment gateway evaluations with greater clarity, context, and confidence - without relying solely on provider websites or sales conversations.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)]">
          <div className="hidden md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-[#f8fafc]">
                  <th className="px-6 py-5 text-sm font-semibold text-slate-700">
                    What Businesses Need
                  </th>
                  <th className="bg-[#EEF2FC] px-6 py-5 text-center text-sm font-bold text-[#2D4CC8]">
                    CompareX
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-slate-600">
                    Independent Research
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-slate-600">
                    Individual Provider Conversations
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
                      Research
                    </p>
                    <div className="mt-2 flex justify-center">
                      <CellValue value={row.alone} />
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Providers
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
        <div className="mt-14">
          <h2 className="text-3xl text-center font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            Built for the Entire Payments{" "}
            <em className="italic text-slate-800">Ecosystem</em>  
          </h2>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)]">
            <div className="hidden md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#f8fafc]">
                    <th className="px-6 py-5 text-sm font-semibold text-slate-700">Stakeholder</th>
                    <th className="bg-[#EEF2FC] px-6 py-5 text-sm font-bold text-[#2D4CC8]">
                      What CompareX Delivers
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ecosystemRows.map((row, index) => (
                    <tr
                      key={row.stakeholder}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 sm:text-base sm:whitespace-nowrap">
                        {row.stakeholder}
                      </td>
                      <td className="bg-[#EEF2FC]/50 px-6 py-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {row.delivers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-200 md:hidden">
              {ecosystemRows.map((row) => (
                <div key={row.stakeholder} className="p-5">
                  <p className="text-sm font-semibold text-slate-900">{row.stakeholder}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{row.delivers}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#2D4CC8]/15 bg-gradient-to-br from-[#EEF2FC] via-white to-[#ECFDF5] px-6 py-8 text-center sm:flex-row sm:text-left sm:px-10">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#2D4CC8]">
              <HiChartBarSquare className="size-6 text-white" aria-hidden />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Ready to Explore Your Options?
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 sm:text-base">
              Compare payment solutions, understand key considerations, access expert guidance and navigate your evaluation journey with greater clarity.

              </p>
            </div>
          </div>
          <Link
            href="/merchant"
            className="group relative inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 text-sm font-medium text-white transition hover:bg-[#3B5BDB]"
            style={{ color: "#fff" }}
          >
            <span className="z-10 pr-2 text-white"> Compare Payment Solutions</span>
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
