import { HeroAdviceForm } from "@/components/website/home/hero-advice-form";
import { MarketingPageShell } from "@/components/website/layout/marketing-page-shell";

export default function Page() {
  return (
    <MarketingPageShell mainClassName="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#eff4ff] via-[#e9f2ff] to-[#ecf9f3]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(59,130,246,0.10) 26px, rgba(59,130,246,0.10) 27px)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-blue-200 bg-white/90 px-4 py-1.5 text-xs font-semibold tracking-tight text-blue-700 shadow-sm backdrop-blur">
            Reseller Form
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Register as a CompareX Reseller Partner
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Fill out the form below to join our partner network. Submit merchant leads, track
            activations, and earn commissions — all from one platform.
          </p>
        </div>

        <div className="mt-10">
          <HeroAdviceForm />
        </div>
      </div>
    </MarketingPageShell>
  );
}
