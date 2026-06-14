import Image from "next/image";
import {
  HiChartBarSquare,
  HiCurrencyRupee,
  HiShieldCheck,
  HiSparkles,
} from "react-icons/hi2";

const reasons = [
  {
    title: "Save time on research",
    description:
      "Skip weeks of comparing websites, sales pitches, and pricing sheets — get matched in minutes.",
    Icon: HiSparkles,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
  },
  {
    title: "Make better decisions",
    description:
      "Side-by-side comparisons, reviews, and benchmarks tailored to your industry and volume.",
    Icon: HiChartBarSquare,
    accent: "text-[#25A36F]",
    iconBg: "bg-[#ECFDF5]",
  },
  {
    title: "Unlock better pricing",
    description:
      "Leverage our partner network for competitive rates and exclusive offers you won't find alone.",
    Icon: HiCurrencyRupee,
    accent: "text-[#0891b2]",
    iconBg: "bg-[#ecfeff]",
  },
//   {
//     title: "Expert guidance",
//     description:
//       "Specialists shortlist the right payment providers based on your goals — not commission targets.",
//     Icon: HiShieldCheck,
//     accent: "text-[#2D4CC8]",
//     iconBg: "bg-[#EEF2FC]",
//   },
];

const highlights = ["Unbiased Comparisons", "Expert Support"];

export default function WhyChooseSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
              Why CompareX
            </span>

            <h2 className="mt-5 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
              Why businesses choose{" "}
              <em className="italic text-slate-800">CompareX</em>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              We combine unbiased comparisons with real expert support — so you pick the right
              payment partner, not just the loudest sales pitch.
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
