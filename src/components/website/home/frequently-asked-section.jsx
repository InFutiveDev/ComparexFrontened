"use client";

import Link from "next/link";
import React, { useState } from "react";
import { HiChevronRight, HiChevronUp } from "react-icons/hi2";

const faqCategories = [
    {
        title: "1. General",
        items: [
            {
                question: "What is CompareX?",
                answer:
                    "CompareX helps businesses discover, compare, and evaluate payment gateways and other business solutions based on their unique requirements.",
            },
            {
                question: "Is CompareX a payment gateway?",
                answer:
                    "No. CompareX is an independent comparison and recommendation platform that helps businesses make informed decisions and connect with relevant solution providers.",
            },
            {
                question: "Is CompareX free for businesses?",
                answer:
                    "Yes. Businesses can compare solutions, access resources, and explore recommendations at no cost.",
            },
            {
                question: "How does CompareX make recommendations?",
                answer:
                    "Recommendations are based on information shared by the business, including industry, transaction volume, business model, payment preferences, and specific requirements.",
            },
        ],
    },
    {
        title: "2. Choosing a Payment Gateway",
        items: [
            {
                question: "How do I know which payment gateway is right for my business?",
                answer:
                    "The right payment gateway depends on factors such as your business category, monthly transaction volume, supported payment methods, settlement requirements, integration needs, and growth plans.",
            },
            {
                question: "Can CompareX help me compare multiple payment gateways?",
                answer:
                    "Yes. CompareX enables businesses to evaluate payment gateways across pricing, features, settlement timelines, integrations, support, and other relevant criteria.",
            },
            {
                question: "Does CompareX rank payment gateways?",
                answer:
                    "CompareX aims to provide transparent information and comparisons to help businesses make informed decisions. Recommendations may vary depending on individual business requirements.",
            },
            {
                question: "Can CompareX help me negotiate better pricing?",
                answer:
                    "Depending on your business profile and transaction volume, CompareX may help facilitate discussions with participating providers regarding commercial terms.",
            },
        ],
    },
    {
        title: "3. Merchant Onboarding",
        items: [
            {
                question: "Can CompareX help me get approved by a payment gateway?",
                answer:
                    "While CompareX can guide you through the evaluation process, onboarding and approval decisions are made solely by the respective payment gateway.",
            },
            {
                question: "What documents are generally required for payment gateway onboarding?",
                answer:
                    "Requirements vary by provider but commonly include business registration documents, PAN, GST details (where applicable), bank account information, website or app details, and KYC documents.",
            },
            {
                question: "How long does payment gateway activation take?",
                answer:
                    "Activation timelines vary based on the provider, business category, documentation completeness, and compliance reviews.",
            },
            {
                question: "My business is newly launched. Can I still apply?",
                answer:
                    "Yes. Many providers support startups and growing businesses, although onboarding requirements and eligibility criteria may differ by provider. Community discussions show approval requirements can vary significantly between gateways.",
            },
        ],
    },
    {
        title: "4. CompareX Expert Assistance",
        items: [
            {
                question: 'What is "Talk to an Expert"?',
                answer:
                    "Talk to an Expert connects businesses with CompareX specialists who can help understand requirements, explain available options, and facilitate introductions to participating providers.",
            },
            {
                question: "Will I be connected directly with payment gateways?",
                answer:
                    "Where appropriate, CompareX may connect businesses with nominated representatives from participating providers for further discussions.",
            },
            {
                question: "Does CompareX guarantee lead approval or onboarding?",
                answer:
                    "No. All commercial, compliance, underwriting, and onboarding decisions remain at the sole discretion of the respective provider.",
            },
        ],
    },
    {
        title: "5. Pricing & Commercials",
        items: [
            {
                question: "Does CompareX charge businesses for recommendations?",
                answer:
                    "No. Businesses can explore comparisons and recommendations without paying CompareX.",
            },
            {
                question: "Are the prices displayed on CompareX final?",
                answer:
                    "Commercials may vary based on business type, transaction volume, risk profile, and provider-specific approval processes.",
            },
            {
                question: "Can enterprise businesses receive custom pricing?",
                answer:
                    "Many providers offer customized commercials for eligible businesses based on transaction volumes and business requirements.",
            },
        ],
    },
    {
        title: "6. Trust & Transparency",
        items: [
            {
                question: "Does CompareX favor certain providers?",
                answer:
                    "CompareX aims to maintain transparency and provide businesses with information that helps them evaluate options based on their own requirements.",
            },
            {
                question: "Are merchant reviews verified?",
                answer:
                    "CompareX may use verification processes and moderation mechanisms to help maintain the quality and authenticity of reviews.",
            },
            {
                question: "How is my business information used?",
                answer:
                    "Business information is used to provide recommendations, facilitate discussions, and improve the relevance of suggested solutions. Please refer to CompareX's Privacy Policy for complete details.",
            },
        ],
    },
];

export const FrequentlyAskedSection = () => {
    const [openCategoryIndex, setOpenCategoryIndex] = useState(0);
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    function toggleCategory(idx) {
        setOpenCategoryIndex((prev) => {
            if (prev === idx) return -1;
            setOpenFaqIndex(0);
            return idx;
        });
    }

    function toggleFaq(idx) {
        setOpenFaqIndex((prev) => (prev === idx ? -1 : idx));
    }

    return (
        <section className="bg-[#f2f6fb]">
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
                            Find quick answers about how our platform helps you evaluate software clearly, skip guesswork,
                            and make confident buying choices for your teams.
                        </p>

                        <div className="mt-6">
                            <Link
                                href="/"
                                className="group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 font-medium text-white"
                                style={{ color: "#fff" }}
                            >
                                <span className="z-10 pr-2 text-white">Get A Quote</span>
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
                            {faqCategories.map((category, categoryIndex) => {
                                const categoryOpen = categoryIndex === openCategoryIndex;

                                return (
                                    <li key={category.title}>
                                        <button
                                            type="button"
                                            onClick={() => toggleCategory(categoryIndex)}
                                            className="group flex w-full items-center gap-4 py-3 text-start"
                                            aria-expanded={categoryOpen}
                                            aria-controls={`faq-category-panel-${categoryIndex}`}
                                            id={`faq-category-trigger-${categoryIndex}`}
                                        >
                                            <span className="min-w-0 flex-1 pr-4">
                                                <span className="block text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#2D4CC8] sm:text-[1.05rem]">
                                                    {category.title}
                                                </span>
                                            </span>
                                            <span
                                                className={`flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm transition-colors duration-200 ${
                                                    categoryOpen
                                                        ? "border-transparent bg-[#2D4CC8] text-white"
                                                        : "border border-slate-200 bg-slate-50 text-slate-600 group-hover:border-[#2D4CC8]/30 group-hover:text-[#2D4CC8]"
                                                }`}
                                                aria-hidden
                                            >
                                                {categoryOpen ? (
                                                    <HiChevronUp className="size-5 shrink-0 text-white" />
                                                ) : (
                                                    <HiChevronRight className="size-5 shrink-0" />
                                                )}
                                            </span>
                                        </button>

                                        <div
                                            id={`faq-category-panel-${categoryIndex}`}
                                            role="region"
                                            aria-labelledby={`faq-category-trigger-${categoryIndex}`}
                                            className={`grid transition-[grid-template-rows] duration-300  ease-out ${
                                                categoryOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                            }`}
                                        >
                                            <div className="overflow-hidden">
                                                <ul className="mb-2 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/60">
                                                    {category.items.map((item, faqIndex) => {
                                                        const faqOpen =
                                                            categoryOpen && faqIndex === openFaqIndex;

                                                        return (
                                                            <li key={item.question}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleFaq(faqIndex)}
                                                                    className="group flex w-full items-start gap-4 px-4 py-5 text-start sm:px-5"
                                                                    aria-expanded={faqOpen}
                                                                    aria-controls={`faq-panel-${categoryIndex}-${faqIndex}`}
                                                                    id={`faq-trigger-${categoryIndex}-${faqIndex}`}
                                                                >
                                                                    <span className="mt-0.5 shrink-0 text-[18px] font-semibold tabular-nums text-slate-500">
                                                                        {String(faqIndex + 1).padStart(2, "0")}
                                                                    </span>
                                                                    <span className="min-w-0 flex-1 pr-3">
                                                                        <span className="block text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#2D4CC8] sm:text-base">
                                                                            {item.question}
                                                                        </span>
                                                                    </span>
                                                                    <span
                                                                        className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                                                                            faqOpen
                                                                                ? "bg-[#2D4CC8] text-white"
                                                                                : "border border-slate-200 bg-white text-slate-600 group-hover:border-[#2D4CC8]/30 group-hover:text-[#2D4CC8]"
                                                                        }`}
                                                                        aria-hidden
                                                                    >
                                                                        {faqOpen ? (
                                                                            <HiChevronUp className="size-4 shrink-0 text-white" />
                                                                        ) : (
                                                                            <HiChevronRight className="size-4 shrink-0" />
                                                                        )}
                                                                    </span>
                                                                </button>
                                                                <div
                                                                    id={`faq-panel-${categoryIndex}-${faqIndex}`}
                                                                    role="region"
                                                                    aria-labelledby={`faq-trigger-${categoryIndex}-${faqIndex}`}
                                                                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                                                        faqOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                                                    }`}
                                                                >
                                                                    <div className="overflow-hidden">
                                                                        <div
                                                                            className={`px-4 pb-5 pt-1 sm:px-5 ${
                                                                                faqOpen
                                                                                    ? "pointer-events-auto rounded-xl bg-[radial-gradient(ellipse_85%_75%_at_50%_100%,rgba(45,76,200,0.18),transparent_62%)]"
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
