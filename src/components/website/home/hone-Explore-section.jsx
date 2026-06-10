"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const cards = [
  {
    id: 1,
    image: "/images/Compare-1.png",
    subtitle: "Compare",
    title: <>Avoid Costly Payment Gateway Mistakes</>,
    description:
      "Choosing the wrong payment gateway can impact your costs, cash flow, customer experience, and future growth. ",
    description2:
      "Compare payment gateways side-by-side on the factors that matter most - pricing, settlement timelines, integrations, onboarding requirements, customer support, industry fit, international payments, subscriptions, and more.",
    description3:
      "No more jumping between websites, decoding complex blogs, or relying solely on sales conversations. ",
    button: "Compare Payment Gateways",
    href: "/compare",
  },
  {
    id: 2,
    image: "/images/consult.png",
    subtitle: "Consult",
    title: <>Get Answers Before You Signup</>,
    description:
      "Every payment gateway has different strengths, onboarding requirements, approval considerations, and operational nuances.",
    description2:
      "Through CompareX, connect with payment professionals to discuss your business requirements, clarify questions, understand onboarding expectations, and explore the options best suited to your needs.",
    description3:
      "Because choosing a payment gateway isn't just about MDRs - it's about finding the right long-term fit.",
    button: "Talk to an Expert",
    href: "/contact",
  },
  {
    id: 3,
    image: "/images/connect.png",
    subtitle: "Connect",
    title: "Support Beyond the Comparison",
    description: "Comparing options is only the first step.",
    description2:
      "From understanding onboarding requirements and evaluating provider expectations to connecting with the right payment teams, CompareX helps simplify the journey from discovery to activation.",
    description3:
      "Whether you're evaluating your first payment gateway, considering a switch, or exploring additional payment solutions, we're here to help you navigate the process with greater clarity and confidence",
    button: "Get Personalized Recommendations",
    href: "/contact",
  },
];

function CardContent({ card }) {
  return (
    <div className="w-full">
      <p className="mb-2 text-base font-medium leading-tight text-[#2D4CC8] sm:text-lg lg:text-[22px]">
        {card.subtitle}
      </p>
      <h2 className="text-xl font-bold leading-tight text-slate-800 sm:text-2xl lg:text-[30px]">
        {card.title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        {card.description}
      </p>
      <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        {card.description2}
      </p>
      <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
        {card.description3}
      </p>
      {card.button && card.href ? (
        <Link
          href={card.href}
          className="mt-5 inline-flex items-center gap-3 text-base font-semibold text-[#2D4CC8] transition hover:text-[#2542b6] sm:text-lg"
        >
          {card.button}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="12"
            viewBox="0 0 8 12"
            fill="none"
            aria-hidden
          >
            <path
              d="M7 6.5L2.25 11.25C1.83579 11.6642 1.16421 11.6642 0.75 11.25C0.335787 10.8358 0.335786 10.1642 0.749999 9.75L4.5 6L0.75 2.25C0.335786 1.83579 0.335787 1.16421 0.75 0.75C1.16421 0.335787 1.83579 0.335787 2.25 0.75L7 5.5C7.27614 5.77614 7.27614 6.22386 7 6.5Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      ) : null}
    </div>
  );
}

export function HoneExploreSection() {
  const [activeCard, setActiveCard] = useState(0);
  const contentRefs = useRef([]);

  useEffect(() => {
    const nodes = contentRefs.current.filter(Boolean);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const index = Number(visible.target.dataset.index);
        if (!Number.isNaN(index)) {
          setActiveCard(index);
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-35% 0px -35% 0px",
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#eef2fa] pb-8 pt-4 sm:pb-10 sm:pt-5 lg:pb-12 lg:pt-20">
      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
        {/* Mobile + tablet: image above each block */}
        <div className="flex flex-col gap-10 lg:hidden">
          {cards.map((card) => (
            <article key={card.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="relative mb-6 aspect-[4/3] w-full sm:aspect-square">
                <Image
                  src={card.image}
                  alt={card.subtitle}
                  fill
                  className="object-contain object-left-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <CardContent card={card} />
            </article>
          ))}
        </div>

        {/* Desktop: sticky image + scroll-synced content */}
        <div className="hidden w-full lg:grid lg:grid-cols-[minmax(0,44%)_minmax(0,56%)] lg:items-start lg:gap-10 xl:gap-14">
          <div className="sticky top-24 min-w-0 self-start overflow-hidden">
            <div className="relative h-[420px] w-full lg:h-[480px] xl:h-[520px]">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeCard === index ? "z-10 opacity-100" : "z-0 opacity-0"
                  }`}
                  aria-hidden={activeCard !== index}
                >
                  <Image
                    src={card.image}
                    alt={card.subtitle}
                    fill
                    className="object-contain object-left-top"
                    sizes="(min-width: 1280px) 38vw, (min-width: 1024px) 42vw, 100vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 min-w-0 bg-[#eef2fa] pl-2 lg:pl-4 xl:pl-6">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="flex min-h-[420px] w-full items-start lg:min-h-[480px] xl:min-h-[520px]"
                data-index={index}
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
              >
                <CardContent card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
