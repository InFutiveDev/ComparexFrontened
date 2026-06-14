export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80">
      <div className="absolute inset-0 bg-gradient-to-br from-[#eff4ff] via-[#eef2fc] to-[#ecfdf5]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(45,76,200,0.06) 26px, rgba(45,76,200,0.06) 27px)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <span className="inline-block rounded-full border border-[#2D4CC8]/20 bg-white/80 px-4 py-1 text-sm font-medium text-[#2D4CC8] backdrop-blur-sm">
          About CompareX
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Helping businesses choose the right payment partner
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          CompareX makes it easy to compare payment gateways, get expert guidance, and make
          confident decisions — free and unbiased.
        </p>

        
      </div>
    </section>
  );
}
