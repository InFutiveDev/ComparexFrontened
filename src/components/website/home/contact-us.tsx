import Link from "next/link";
import React from "react";
import { HiArrowRight, HiOutlineGlobeAlt } from "react-icons/hi2";

export const ContactUs = () => {
    return (
        <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-[#eff4ff] via-[#e9f2ff] to-[#ecf9f3] px-6 py-16 text-center shadow-[0_20px_60px_-30px_rgba(30,58,138,0.35)] sm:rounded-[2.5rem] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
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


                    <div className="relative mx-auto flex max-w-2xl flex-col items-center">
                        <span className="inline-flex rounded-full border border-blue-200 bg-white/90 px-4 py-1.5 text-xs font-semibold tracking-tight text-blue-700 shadow-sm backdrop-blur">
                            Launch with ease
                        </span>
                        <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.7rem] lg:leading-tight">
                            Launch Your Free Trial Today
                        </h2>
                        <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
                            Experience the full power of our platform for 14 days. No credit card required, no strings attached.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/"
                                className="group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full bg-[#2D4CC8] py-1 pl-6 pr-14 font-medium text-white"
                                style={{ color: "#fff" }}
                            >
                                <span className="z-10 pr-2 text-white">Contact Us</span>
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
                </div>
            </div>
        </section>
    );
};
