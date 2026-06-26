import Image from "next/image";
import {
  HiChartBarSquare,
  HiCurrencyRupee,
  HiShieldCheck,
  HiSparkles,
} from "react-icons/hi2";

const reasons = [
  {
    title: "Compare Multiple Solutions in One Place",
    description:
      "Evaluate payment gateways across pricing, settlement timelines, integrations, onboarding requirements, support, and more.",
    Icon: HiSparkles,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
  },
  {
    title: "Make Decisions Based on Fit, Not Hype",
    description:
      "Understand which solutions align best with your business model, industry, operational needs, and growth plans.",
    Icon: HiChartBarSquare,
    accent: "text-[#25A36F]",
    iconBg: "bg-[#ECFDF5]",
  },
  {
    title: "Access Practical Guidance",
    description:
      "Connect with experienced payment professionals to gain additional context before making important decisions.",
    Icon: HiCurrencyRupee,
    accent: "text-[#0891b2]",
    iconBg: "bg-[#ecfeff]",
  },
  {
    title: "Save Time During Evaluation",
    description:
      "Reduce the effort spent researching, comparing, and navigating multiple provider websites.",
    Icon: HiShieldCheck,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
  },
];

const highlights = ["Unbiased Comparisons", "Expert Support"];

export default function WhyChooseSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
            Built for Better Payment Decisions
            </span>

            <h2 className="mt-5 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            More Clarity. Less {" "}
              <em className="italic text-slate-800">Guesswork.</em>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            Businesses deserve more than marketing claims, sales pitches, and scattered information when evaluating solutions that impact revenue, cash flow, operations, and customer experience.
            </p>
            <p className="mt-1 text-base leading-relaxed text-slate-600 sm:text-lg">
            CompareX brings together the tools, insights, and guidance needed to evaluate payment solutions with greater confidence and context.
            </p>

            <ul className="mt-10 space-y-6">
              {reasons.map(({ title, description, Icon, accent, iconBg }) => (
                <li key={title} className="flex gap-4">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                  >
                    <Icon className={`size-5 ${accent}`} aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

           
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[520px]">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80"
                alt="Team discussing payment solutions"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="absolute bottom-6 left-4 flex flex-col gap-3 sm:bottom-8 sm:left-6">
              {highlights.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/25 px-4 py-3 shadow-lg backdrop-blur-md"
                >
                  <span className="text-sm font-medium text-white drop-shadow-sm sm:text-base">
                    {label}
                  </span>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#25A36F]">
                    <svg
                      viewBox="0 0 12 12"
                      className="size-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
