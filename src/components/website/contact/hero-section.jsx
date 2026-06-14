"use client";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80">
      <div className="absolute inset-0 bg-gradient-to-br from-[#eff4ff] via-[#eef2fc] to-[#ecfdf5]" />
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <span className="inline-block rounded-full border border-[#2D4CC8]/20 bg-white/80 px-4 py-1 text-sm font-medium text-[#2D4CC8] backdrop-blur-sm">
          Contact Us
        </span>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Need a custom setup? Reach us and we will help you launch fast.</h2>
      </div>
    </section>
  );
}

