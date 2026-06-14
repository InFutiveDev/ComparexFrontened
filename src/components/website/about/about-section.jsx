import Image from "next/image";
import { HiChartBarSquare, HiShieldCheck, HiUsers } from "react-icons/hi2";



const highlights = ["Free Recommendations", "No Hidden Commissions"];

export default function AboutSection() {
  return (
    <section className="overflow-hidden bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
              Who We Are
            </span>

            <h2 className="mt-6 text-4xl leading-[1.15] font-medium tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Built to simplify how India chooses{" "}
              <em className="italic text-slate-800">payment partners</em>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              CompareX started with a simple idea: businesses shouldn&apos;t need weeks of research
              to find the right payment gateway. We combine comparisons, reviews, and expert advice
              so every team can move forward with clarity.
            </p>
            <p className="mt-1 text-base leading-relaxed text-slate-600 sm:text-lg">
              CompareX started with a simple idea: businesses shouldn&apos;t need weeks of research
              to find the right payment gateway. We combine comparisons, reviews, and expert advice
              so every team can move forward with clarity.
            </p>
          <p className="mt-1 text-base leading-relaxed text-slate-600 sm:text-lg">
            CompareX started with a simple idea: businesses shouldn&apos;t need weeks of research
            to find the right payment gateway. We combine comparisons, reviews, and expert advice
            so every team can move forward with clarity.
          </p>
            
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[520px]">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80"
                alt="CompareX team working together"
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
