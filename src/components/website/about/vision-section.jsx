import { HiEye, HiRocketLaunch } from "react-icons/hi2";

const pillars = [
  {
    id: "vision",
    label: "Our Vision",
    title: "To become the most trusted starting point for businesses evaluating payment solutions.",
    description:
      "To create a more transparent, informed, and efficient payment decision ecosystem for businesses. We believe every business deserves access to clear information, meaningful comparisons, and practical guidance when making decisions that impact growth, operations, cash flow, and customer experience.",
    Icon: HiEye,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
    gradient: "from-[#2D4CC8] via-[#3B5BDB] to-[#40C3CF]",
    ring: "ring-[#2D4CC8]/10",
    hoverBorder: "hover:border-[#2D4CC8]/30",
  },
  {
    id: "mission",
    label: "Our Mission",
    title: "Helping Businesses Navigate Complexity with Confidence",
    description:
      "The payments ecosystem continues to evolve, giving businesses more choices than ever before. Our mission is to simplify how businesses discover, compare, and evaluate those choices by providing access to relevant information, practical tools, and expert guidance that support better decision-making throughout the evaluation journey.",
    Icon: HiRocketLaunch,
    accent: "text-[#25A36F]",
    iconBg: "bg-[#ECFDF5]",
    gradient: "from-[#25A36F] via-[#2D9F6F] to-[#40C3CF]",
    ring: "ring-[#25A36F]/10",
    hoverBorder: "hover:border-[#25A36F]/30",
  },
];

export default function VisionSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(45,76,200,0.05) 26px, rgba(45,76,200,0.05) 27px)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-[#2D4CC8]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-10 size-72 rounded-full bg-[#25A36F]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
            Vision & Mission
          </span>
          <h2 className="mt-5 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            Empowering Better Payment Decisions for{" "}
            <em className="italic text-slate-800">Every Business</em>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            We are building a clearer path for businesses to evaluate payment solutions with
            transparency, context, and confidence.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {pillars.map(
            ({ id, label, title, description, Icon, accent, iconBg, gradient, ring, hoverBorder }) => (
              <article
                key={id}
                className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)] ring-1 ${ring} transition hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(15,23,42,0.2)] ${hoverBorder}`}
              >
                <div className={`h-1.5 bg-gradient-to-r ${gradient}`} aria-hidden />

                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} transition group-hover:scale-105`}
                    >
                      <Icon className={`size-6 ${accent}`} aria-hidden />
                    </div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${accent}`}>
                      {label}
                    </p>
                  </div>

                  <h3 className="cx-heading mt-5 text-xl leading-snug text-slate-900 sm:text-2xl">
                    {title}
                  </h3>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {description}
                  </p>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}
