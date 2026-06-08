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
                        <div className="mt-6 w-full max-w-xl">
                            <form action="">
                                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                                    <div className="col-span-1">
                                        <input type="text" placeholder="Enter your name" className="w-full rounded-full border border-[#2D4CC8] px-4 py-2 text-gray-600" />
                                    </div>
                                    
                                    <div className="col-span-1">
                                        <input type="tel" placeholder="Enter your phone number" className="w-full rounded-full border border-[#2D4CC8] px-4 py-2 text-gray-600" />
                                    </div>
                                    <div className="col-span-2">
                                        <input type="email" placeholder="Enter your email" className="w-full rounded-full border border-[#2D4CC8] px-4 py-2 text-gray-600" />
                                    </div>
                                    <div className="col-span-2">
                                        <textarea name="message" id="message" placeholder="Enter your message" className="w-full rounded-full border border-[#2D4CC8] px-4 py-2 text-gray-600"></textarea>
                                    </div>
                                    <div className="mt-2">
                                        <button type="submit" className="w-full cursor-pointer rounded-full bg-[#2D4CC8] px-4 py-2 text-white group relative inline-flex h-[calc(48px+8px)] items-center justify-center rounded-full py-1 pl-6 pr-14 font-medium text-white" style={{ color: "#fff" }}>
                                            <span className="z-10 pr-2 text-white">Contact Us</span>
                                            <div className="absolute right-1 inline-flex h-12 w-12 items-center justify-end rounded-full bg-[#25a36f] transition-[width] group-hover:w-[calc(100%-8px)]">
                                                <div className="mr-3.5 flex items-center justify-center">
                                                    <HiArrowRight className="size-5 text-neutral-50" />
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
