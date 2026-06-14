"use client";

import Link from "next/link";
import React, { useState } from "react";
import { HiChevronRight, HiChevronUp } from "react-icons/hi2";

const faqs = [
  {
    question: "Why should a PG list on CompareX?",
    answer:
      "CompareX helps providers improve visibility, receive qualified merchant leads, showcase strengths transparently, and reduce merchant education efforts during sales.",
  },
  {
    question: "How are leads shared with PGs?",
    answer:
      "Leads are routed based on merchant fit, business requirements, onboarding suitability, and provider capabilities.",
  },
  {
    question: "Can PGs update their pricing, features, and offerings?",
    answer:
      "Yes. Providers can manage and update their profiles, products, pricing, integrations, smart tags, and onboarding information through their dashboard.",
  },
  {
    question: "Can PG teams interact directly with merchants?",
    answer:
      "Yes. Providers can nominate experts and sales SPOCs for “Talk to Expert” consultations and lead management.",
  },
  {
    question: "Can PGs respond to merchant reviews?",
    answer:
      "Yes. Verified providers can respond to reviews, resolve concerns, and engage with merchants publicly through the platform.",
  },
  {
    question: "Does CompareX prioritize one provider over another?",
    answer:
      "No. CompareX follows a neutral and merchant-first comparison approach focused on business suitability and transparency.",
  },
];

export const FrequentlyAskedSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  function toggle(idx) {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-8xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-16 lg:items-start">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
              FAQs
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem]">
              Frequently Asked
              <br />
              Questions
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Find quick answers about how CompareX helps payment providers get discovered, receive
              qualified leads, and grow merchant acquisition.
            </p>

            <div className="mt-6">
              <Link
                href="/payment/form"
                className="group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 font-medium text-white"
                style={{ color: "#fff" }}
              >
                <span className="z-10 pr-2 text-white">Get Started</span>
                <div className="absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
                  <div className="mr-3.5 flex items-center justify-center">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-neutral-50"
                    >
                      <path
                        d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/95 px-6 py-2 shadow-[0_16px_48px_-24px_rgba(15,23,42,0.22)] backdrop-blur sm:px-8">
            <ul className="divide-y divide-slate-100">
              {faqs.map((item, index) => {
                const open = index === openIndex;
                return (
                  <li key={item.question}>
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      className="group flex w-full items-start gap-4 py-6 text-start"
                      aria-expanded={open}
                      aria-controls={`payment-faq-panel-${index}`}
                      id={`payment-faq-trigger-${index}`}
                    >
                      <span className="mt-0.2 shrink-0 text-[20px] font-semibold tabular-nums text-slate-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 pr-4">
                        <span className="block text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#2D4CC8] sm:text-[1.05rem]">
                          {item.question}
                        </span>
                      </span>
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-colors duration-200 ${
                          open
                            ? "border-transparent bg-[#2D4CC8] text-white"
                            : "border border-slate-200 bg-slate-50 text-slate-600 group-hover:border-[#2D4CC8]/30 group-hover:text-[#2D4CC8]"
                        }`}
                        aria-hidden
                      >
                        {open ? (
                          <HiChevronUp className="size-5 shrink-0 text-white" />
                        ) : (
                          <HiChevronRight className="size-5 shrink-0" />
                        )}
                      </span>
                    </button>
                    <div
                      id={`payment-faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`payment-faq-trigger-${index}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div
                          className={`px-4 pb-6 pt-2 ${
                            open
                              ? "pointer-events-auto rounded-xl bg-[radial-gradient(ellipse_85%_75%_at_50%_100%,rgba(45,76,200,0.22),transparent_62%)] bg-slate-50/55"
                              : "pointer-events-none"
                          }`}
                        >
                          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
