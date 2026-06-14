import Image from "next/image";
import Link from "next/link";
import {
  HiArrowRight,
  HiBuildingOffice2,
  HiChartBarSquare,
  HiClipboardDocumentList,
  HiCreditCard,
  HiInboxArrowDown,
  HiRocketLaunch,
  HiShare,
  HiShieldCheck,
  HiSquares2X2,
  HiUserGroup,
} from "react-icons/hi2";

const flows = [
  {
    id: "merchant",
    badge: "For Merchants",
    heading: "Find the right payment gateway",
    highlight: "without the guesswork",
    description:
      "Share your business needs, compare providers side by side, and activate faster with expert support — all in one place.",
    steps: [
      {
        title: "Share your business needs",
        description:
          "Tell us about your industry, transaction volume, and payment priorities — takes just a few minutes.",
        Icon: HiBuildingOffice2,
        accent: "text-[#25A36F]",
        iconBg: "bg-[#ECFDF5]",
      },
      {
        title: "Compare gateways side by side",
        description:
          "Review pricing, features, onboarding speed, and integrations in one unbiased comparison view.",
        Icon: HiSquares2X2,
        accent: "text-[#2D4CC8]",
        iconBg: "bg-[#EEF2FC]",
      },
      {
        title: "Activate with expert support",
        description:
          "Get matched, onboard faster, and go live with CompareX guiding you through every step.",
        Icon: HiRocketLaunch,
        accent: "text-[#0891b2]",
        iconBg: "bg-[#ecfeff]",
      },
    ],
    highlights: ["Free Recommendations", "Unbiased Comparisons"],
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Merchant comparing payment gateways",
    cta: { href: "/merchant", label: "Explore as Merchant" },
    reverse: false,
  },
  {
    id: "reseller",
    badge: "For Resellers",
    heading: "Grow your partner business",
    highlight: "with qualified leads",
    description:
      "Register on CompareX, refer merchant leads, and earn commissions while we handle qualification and coordination.",
    steps: [
      {
        title: "Join as a partner",
        description:
          "Register on CompareX and start referring merchant leads through a single trusted platform.",
        Icon: HiShare,
        accent: "text-[#2D4CC8]",
        iconBg: "bg-[#EEF2FC]",
      },
      {
        title: "Submit & track leads",
        description:
          "We handle qualification, provider coordination, and follow-ups — you focus on relationships.",
        Icon: HiClipboardDocumentList,
        accent: "text-[#25A36F]",
        iconBg: "bg-[#ECFDF5]",
      },
      {
        title: "Earn on every activation",
        description:
          "Monitor progress, activations, and commissions from your partner dashboard in real time.",
        Icon: HiChartBarSquare,
        accent: "text-[#0891b2]",
        iconBg: "bg-[#ecfeff]",
      },
    ],
    highlights: ["Lead Tracking", "Commission Payouts"],
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Reseller team collaborating",
    cta: { href: "/reseller", label: "Join as Partner" },
    reverse: true,
  },
  {
    id: "payment",
    badge: "For PA / PG",
    heading: "Reach merchants actively",
    highlight: "looking for you",
    description:
      "List your gateway on CompareX, receive qualified leads, and build trust through reviews and expert visibility.",
    steps: [
      {
        title: "List your gateway",
        description:
          "Create a marketplace profile with pricing, integrations, onboarding strengths, and smart tags.",
        Icon: HiClipboardDocumentList,
        accent: "text-[#0891b2]",
        iconBg: "bg-[#ecfeff]",
      },
      {
        title: "Receive qualified leads",
        description:
          "Get matched with merchants actively searching for a payment solution like yours.",
        Icon: HiInboxArrowDown,
        accent: "text-[#2D4CC8]",
        iconBg: "bg-[#EEF2FC]",
      },
      {
        title: "Convert & build trust",
        description:
          "Manage leads, respond to reviews, and grow merchant relationships through CompareX.",
        Icon: HiShieldCheck,
        accent: "text-[#25A36F]",
        iconBg: "bg-[#ECFDF5]",
      },
    ],
    highlights: ["Qualified Leads", "Marketplace Visibility"],
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Payment provider dashboard overview",
    cta: { href: "/payment", label: "List Your PG" },
    reverse: false,
  },
];

function RoleIcon({ id }) {
  if (id === "merchant") return <HiBuildingOffice2 className="size-4" aria-hidden />;
  if (id === "reseller") return <HiUserGroup className="size-4" aria-hidden />;
  return <HiCreditCard className="size-4" aria-hidden />;
}

function FlowBlock({ flow }) {
  return (
    <div className="grid grid-cols-1 items-start gap-10 sm:gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-16">
      <div
        className={`flex w-full flex-col justify-center lg:py-4 ${
          flow.reverse ? "lg:order-2 lg:pl-6 xl:pl-10" : "lg:pr-6 xl:pr-10"
        }`}
      >
        <div className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
          <span className="inline-flex items-center gap-2 rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
            <RoleIcon id={flow.id} />
            {flow.badge}
          </span>

          <h2 className="mt-5 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            {flow.heading}{" "}
            <em className="italic text-slate-800">{flow.highlight}</em>
          </h2>

          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">{flow.description}</p>

          <ul className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
            {flow.steps.map(({ title, description, Icon, accent, iconBg }, index) => (
              <li key={title} className="flex items-start gap-4">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                >
                  <Icon className={`size-5 ${accent}`} aria-hidden />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href={flow.cta.href}
            className="group relative mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 text-sm font-medium text-white transition hover:bg-[#3B5BDB] hover:text-white sm:mt-10 sm:text-base"
            style={{ color: "#fff" }}
          >
            <span className="z-10 pr-2 text-white">{flow.cta.label}</span>
            <span className="absolute right-1 inline-flex h-10 w-10 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
              <span className="mr-3 flex items-center justify-center">
                <HiArrowRight className="size-5 text-white" aria-hidden />
              </span>
            </span>
          </Link>
        </div>
      </div>

      <div
        className={`relative w-full lg:min-h-[520px] ${
          flow.reverse ? "lg:order-1 lg:pr-6 xl:pr-10" : "lg:pl-6 xl:pl-10"
        }`}
      >
        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)] sm:aspect-[5/4] lg:mx-0 lg:max-w-none lg:absolute lg:inset-0 lg:aspect-auto lg:min-h-0">
          <Image
            src={flow.image}
            alt={flow.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          <div className="absolute bottom-6 left-4 flex flex-col gap-3 sm:bottom-8 sm:left-6">
            {flow.highlights.map((label) => (
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
  );
}

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
            Simple 3-step flow
          </span>
          <h2 className="mt-5 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl">
            How CompareX works for{" "}
            <em className="italic text-slate-800">every role</em>
          </h2>
          
        </div>

        <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-28 lg:space-y-32">
          {flows.map((flow) => (
            <FlowBlock key={flow.id} flow={flow} />
          ))}
        </div>
      </div>
    </section>
  );
}
