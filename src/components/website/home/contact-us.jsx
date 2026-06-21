"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiArrowRight, HiCheck, HiChevronDown } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";

const inputClass =
    "w-full rounded-full border border-[#2D4CC8] px-4 py-2.5 text-sm text-gray-600 outline-none transition focus:border-[#25a36f] focus:ring-2 focus:ring-[#25a36f]/25 sm:text-base";

const labelClass = "mb-1.5 block text-left text-sm font-medium text-slate-700";

function SearchableSelect({
    id,
    name,
    options,
    placeholder,
    required = false,
    toggleAriaLabel = "Toggle options",
}) {
    const listboxId = `${id}-listbox`;
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(query.trim().toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSelect(option) {
        setQuery(option);
        setOpen(false);
    }

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <IoSearch
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#2D4CC8]"
                    aria-hidden
                />
                <input
                    id={id}
                    name={name}
                    type="text"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder}
                    className={`${inputClass} pl-10 pr-10`}
                    required={required}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={listboxId}
                    aria-autocomplete="list"
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setOpen((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#2D4CC8] transition hover:bg-[#2D4CC8]/10"
                    aria-label={toggleAriaLabel}
                >
                    <HiChevronDown className={`size-4 transition ${open ? "rotate-180" : ""}`} aria-hidden />
                </button>
            </div>

            {open && (
                <ul
                    id={listboxId}
                    role="listbox"
                    className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-2xl border border-[#2D4CC8]/30 bg-white py-1 shadow-lg"
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li key={option} role="option" aria-selected={query === option}>
                                <button
                                    type="button"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSelect(option)}
                                    className="w-full px-4 py-2.5 text-left text-sm text-gray-600 transition hover:bg-[#2D4CC8]/10 hover:text-[#13203F]"
                                >
                                    {option}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2.5 text-sm text-slate-500">
                            No match found — your entry will be used
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}

const paymentGatewayOptions = [
    "Razorpay",
    "Cashfree",
    "PayU",
    "CCAvenue",
    "Easebuzz",
    "Stripe",
    "Paytm",
    "PhonePe",
    "Amazon Pay",
    "Other",
];

const issueCategoryOptions = [
    "Onboarding Delay",
    "Activation & Account Setup",
    "Documentation / KYC Query",
    "Settlement & Reconciliation Query",
    "Integration Support",
    "Account Manager Assistance",
    "General Query",
    "Other",
];

const whyReachOutItems = [
    "Independent Payment Expertise",
    "Experience Across Multiple Payment Providers",
    "Guidance Beyond a Single Provider",
    "Support Throughout the Merchant Journey",
];

const disclosureText =
    "CompareX provides independent assistance and may facilitate communication with participating payment providers. Final decisions and resolutions remain with the respective provider.";

function GreenTickIcon({ className = "mt-0.5 shrink-0" }) {
    return (
        <Image
            src="/images/icon-1.svg"
            alt=""
            width={20}
            height={20}
            className={className}
            aria-hidden
        />
    );
}

function ContactThankYou() {
    return (
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-[#2D4CC8]/20 bg-white/90 px-6 py-10 text-center shadow-lg sm:px-10">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#25a36f] text-white">
                <HiCheck className="size-7" aria-hidden />
            </div>
            <h2 className="text-2xl mt-5 font-bold text-slate-900 sm:text-2xl">
                Thank you 
            </h2>
            <h3 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
                Your request has been submitted successfully.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                Our team will review the information provided and assess the available support or
                communication options relevant to your query.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                If additional information is required, a member of our team may contact you.
            </p>
        </div>
    );
}

export const ContactUs = () => {
    const [submitted, setSubmitted] = useState(false);
    const [showDisclosure, setShowDisclosure] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        setSubmitted(true);
    }

    useEffect(() => {
        if (!submitted) return;

        const timer = window.setTimeout(() => {
            setSubmitted(false);
            setShowDisclosure(false);
        }, 5000);

        return () => window.clearTimeout(timer);
    }, [submitted]);

    return (
        <section
            id="merchant-assistance-desk"
            className="scroll-mt-24 bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
        >
            <div className="mx-auto max-w-7xl">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#eff4ff] via-[#e9f2ff] to-[#ecf9f3] px-5 py-12 text-center shadow-[0_20px_60px_-30px_rgba(30,58,138,0.35)] sm:rounded-[2.5rem] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.35]"
                        aria-hidden
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(59,130,246,0.10) 26px, rgba(59,130,246,0.10) 27px)",
                        }}
                    />
                    <div
                        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#60a5fa]/20 blur-3xl"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#34d399]/20 blur-3xl"
                        aria-hidden
                    />

                    <div className="relative mx-auto flex w-full  flex-col items-center">
                        <span className="inline-flex rounded-full border border-blue-200 bg-white/90 px-4 py-1.5 text-xs font-semibold tracking-tight text-blue-700 shadow-sm backdrop-blur">
                        CompareX Merchant Support Desk 
                        </span>
                        <h2 className="mt-6 text-balance text-[30px] font-bold tracking-tight text-slate-900 sm:text-[30px] lg:text-[30px] lg:leading-tight">
                        Need Help navigating a Payment Gateway Issue?
                        </h2>
                        <p className="mt-4 max-w-full text-pretty text-sm leading-relaxed text-slate-600 sm:text-lg">
                        Facing onboarding delays, settlement queries, activation challenges, or difficulty reaching the right support teams?
                        </p>
                        <p className="mt-1 max-w-full text-pretty text-sm leading-relaxed text-slate-600 sm:text-lg">
                        CompareX provides independent assistance and helps businesses navigate payment gateway-related concerns with greater clarity and confidence.
                        </p>
                        <div className="mt-6 w-full">
                            {submitted ? (
                                <ContactThankYou />
                            ) : (
                            <form onSubmit={handleSubmit}>                                <div className="grid grid-cols-1 gap-4 text-left lg:grid-cols-6">
                                    <div className="lg:col-span-2">
                                        <label htmlFor="business-name" className={labelClass}>
                                            Business Name
                                        </label>
                                        <input
                                            id="business-name"
                                            name="businessName"
                                            type="text"
                                            placeholder="Enter business name"
                                            className={inputClass}
                                            required
                                        />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <label htmlFor="contact-number" className={labelClass}>
                                        Phone number (WhatsApp preferred)
                                        </label>
                                        <input
                                            id="contact-number"
                                            name="contactNumber"
                                            type="tel"
                                            placeholder="Enter contact number"
                                            className={inputClass}
                                            required
                                        />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <label htmlFor="business-email" className={labelClass}>
                                            Business Email
                                        </label>
                                        <input
                                            id="business-email"
                                            name="businessEmail"
                                            type="email"
                                            placeholder="Enter business email"
                                            className={inputClass}
                                            required
                                        />
                                        
                                    </div>
                                    <div className="lg:col-span-2">
                                        <label htmlFor="website" className={labelClass}>
                                            Website <span className="font-normal text-slate-500">(Optional)</span>
                                        </label>
                                        <input
                                            id="website"
                                            name="website"
                                            type="url"
                                            placeholder="https://example.com"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div className="sm:col-span-2 lg:col-span-2">
                                        <label htmlFor="payment-gateway" className={labelClass}>
                                            Payment Gateway
                                        </label>
                                        <SearchableSelect
                                            id="payment-gateway"
                                            name="paymentGateway"
                                            options={paymentGatewayOptions}
                                            placeholder="Search or enter payment gateway"
                                            toggleAriaLabel="Toggle payment gateway options"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="sm:col-span-2 lg:col-span-2">
                                        <label htmlFor="issue-category" className={labelClass}>
                                            Issue Category
                                        </label>
                                        <SearchableSelect
                                            id="issue-category"
                                            name="issueCategory"
                                            options={issueCategoryOptions}
                                            placeholder="Search or select issue category"
                                            toggleAriaLabel="Toggle issue category options"
                                            required
                                        />
                                    </div>
                                    

                                    <div className="sm:col-span-2 lg:col-span-6">
                                        <label htmlFor="issue-description" className={labelClass}>
                                            Describe Your Issue
                                        </label>
                                        <textarea
                                            id="issue-description"
                                            name="issueDescription"
                                            rows={4}
                                            placeholder="Describe your issue in detail"
                                            className="w-full resize-none rounded-2xl border border-[#2D4CC8] px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-[#25a36f] focus:ring-2 focus:ring-[#25a36f]/25 sm:text-base"
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-6">
                                        <label htmlFor="attachments" className={labelClass}>
                                            Upload Screenshot / Documents{" "}
                                            <span className="font-normal text-slate-500">(Optional)</span>
                                        </label>
                                        <input
                                            id="attachments"
                                            name="attachments"
                                            type="file"
                                            accept="image/*,.pdf,.doc,.docx"
                                            multiple
                                            className="w-full rounded-2xl border border-dashed border-[#2D4CC8]/60 bg-white/80 px-4 py-3 text-sm text-slate-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#2D4CC8]/10 file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-[#2D4CC8] hover:file:bg-[#2D4CC8]/15"
                                        />
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-6">
                                        <label className="flex cursor-pointer items-start gap-3 text-left">
                                            <input
                                                type="checkbox"
                                                name="disclaimerAccepted"
                                                className="mt-1 size-4 shrink-0 rounded border-[#2D4CC8] text-[#25a36f] focus:ring-[#25a36f]/25"
                                                required
                                            />
                                            <span className="text-sm leading-relaxed text-slate-600">
                                                I understand that CompareX acts as an independent assistance and facilitation
                                                platform. Any final decisions, approvals, or resolutions remain solely with
                                                the respective payment provider.
                                            </span>
                                        </label>
                                    </div>

                                    <div className="mt-1 sm:col-span-2 lg:col-span-6">
                                        <button
                                            type="submit"
                                            className="group relative inline-flex h-[calc(48px+8px)] w-full cursor-pointer items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 font-medium text-white sm:w-auto"
                                            style={{ color: "#fff" }}
                                        >
                                            <span className="z-10 pr-2 text-white">Submit Request</span>
                                            <div className="absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
                                                <div className="mr-3.5 flex items-center justify-center">
                                                    <HiArrowRight className="size-5 text-neutral-50" />
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 rounded-2xl border border-[#2D4CC8]/15 bg-white/10 p-5 text-left shadow-sm backdrop-blur-sm sm:p-6">
                                    <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                                        Why Reach out to Comparex
                                    </h3>
                                    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {whyReachOutItems.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/10 px-4 py-3 shadow-sm transition hover:border-[#2D4CC8]/25 hover:shadow-md"
                                            >
                                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#25a36f]/15 to-[#2D4CC8]/10">
                                                    <GreenTickIcon className="size-5 shrink-0" />
                                                </span>
                                                <span className="text-sm font-medium leading-snug text-slate-700 sm:text-[15px]">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6 text-left text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setShowDisclosure((prev) => !prev)}
                                        className="cursor-pointer font-semibold text-[#2D4CC8] underline-offset-2 transition hover:text-[#25a36f] hover:underline"
                                        aria-expanded={showDisclosure}
                                    >
                                        Disclosure
                                    </button>
                                    {showDisclosure && (
                                        <p className="mt-2 leading-relaxed text-slate-500">
                                            {disclosureText}
                                        </p>
                                    )}
                                </div>
                            </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};