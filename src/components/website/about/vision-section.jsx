import { HiEye, HiRocketLaunch } from "react-icons/hi2";

const pillars = [
  {
    id: "vision",
    label: "Our Vision",
    title: "A clearer future for every payment decision",
    description:
      "To become India's most trusted platform where businesses, partners, and payment providers connect with clarity — not confusion.",
    Icon: HiEye,
    accent: "text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC]",
    border: "hover:border-[#2D4CC8]/25",
  },
  {
    id: "mission",
    label: "Our Mission",
    title: "Better choices through unbiased guidance",
    description:
      "We simplify payment gateway selection with side-by-side comparisons, expert advice, and transparent recommendations — free for everyone.",
    Icon: HiRocketLaunch,
    accent: "text-[#25A36F]",
    iconBg: "bg-[#ECFDF5]",
    border: "hover:border-[#25A36F]/25",
  },
];

export default function VisionSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(45,76,200,0.05) 26px, rgba(45,76,200,0.05) 27px)",
        }}
      />

      <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
            Vision & Mission
          </span>
          <h2 className=" mt-5 text-4xl font-medium text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            Building the future of{" "}
            <em className="text-slate-800">payment solutions</em>
          </h2>
         
        </div>

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-2">
          {pillars.map(({ id, label, title, description, Icon, accent, iconBg, border }) => (
            <article
              key={id}
              className={`rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-8 ${border}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}
                >
                  <Icon className={`size-6 ${accent}`} aria-hidden />
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${accent}`}>
                    {label}
                  </p>
                  <h3 className="cx-heading mt-2 text-xl text-slate-900 sm:text-2xl">{title}</h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
                {description}
              </p>
            </article>
          ))}
        </div>

        
      </div>
    </section>
  );
}
