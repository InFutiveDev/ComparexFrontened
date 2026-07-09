"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineChevronDown,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { useTalkToExpert } from "@/components/website/talk-to-expert/talk-to-expert-provider";
import {
  POPULAR_PLATFORMS,
  getProvidersForPlatform,
  resolvePlatformName,
  searchPlatforms,
} from "@/lib/pg-plugin-platforms";
import { pgNameToSlug } from "@/lib/pg-slug";

const inputClass =
  "w-full rounded-full border border-[#2D4CC8] bg-white px-4 py-3 pl-11 pr-11 text-sm text-[#13203F] outline-none transition placeholder:text-slate-400 focus:border-[#40C3CF] focus:ring-2 focus:ring-[#40C3CF]/20 sm:text-base";

const providerCardStyles = [
  {
    cardBg: "bg-gradient-to-b from-[#EEF2FC] to-white",
    accent: "bg-[#2D4CC8]",
    chipBg: "bg-[#EEF2FC] text-[#2D4CC8]",
    iconBg: "bg-[#EEF2FC] border-[#2D4CC8]/25",
    iconColor: "text-[#2D4CC8]",
  },
  {
    cardBg: "bg-gradient-to-b from-[#ECFDF5] to-white",
    accent: "bg-[#25a36f]",
    chipBg: "bg-[#ECFDF5] text-[#25a36f]",
    iconBg: "bg-[#ECFDF5] border-[#25a36f]/25",
    iconColor: "text-[#25a36f]",
  },
];

function ProviderCard({ firm, index }) {
  const slug = pgNameToSlug(firm.name);
  const style = providerCardStyles[index % providerCardStyles.length];

  return (
    <Link
      href={`/compare-pg/${slug}`}
      className={`group relative block overflow-hidden rounded-2xl border border-slate-200 px-5 py-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md ${style.cardBg}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${style.accent}`} aria-hidden />

      <div
        className={`absolute right-4 top-4 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${style.chipBg}`}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <p className={`text-left text-xs font-bold uppercase tracking-[0.14em] ${style.iconColor}`}>
        Provider
      </p>

      <div
        className={`relative z-10 mx-auto mt-5 flex size-14 items-center justify-center rounded-2xl border text-lg font-bold ${style.iconBg} ${style.iconColor} transition group-hover:scale-105`}
      >
        {firm.logo}
      </div>

      <h3 className="mt-5 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
        {firm.name}
      </h3>
    </Link>
  );
}

function PopularPlatformsTable({ selectedPlatform, onSelectPlatform }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full border-collapse">
        <thead className="bg-[#f4f6fc]">
          <tr className="border-b border-slate-200 text-left">
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Platform
            </th>
            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Select
            </th>
          </tr>
        </thead>
        <tbody>
          {POPULAR_PLATFORMS.map((platform, index) => {
            const isSelected = resolvePlatformName(selectedPlatform) === platform;

            return (
              <tr
                key={platform}
                className={`border-b border-slate-100 transition hover:bg-[#f8faff] ${
                  index === POPULAR_PLATFORMS.length - 1 ? "border-b-0" : ""
                } ${isSelected ? "bg-[#EEF2FC]" : ""}`}
              >
                <td className="px-4 py-3 text-sm font-medium text-[#13203F]">{platform}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onSelectPlatform(platform)}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? "border-[#2D4CC8] bg-[#2D4CC8] text-white"
                        : "border-slate-200 bg-white text-[#2D4CC8] hover:border-[#2D4CC8]/40"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PlatformSearchField({ value, onChange, onSelect }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const options = useMemo(() => searchPlatforms(value), [value]);

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
    onSelect(option);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <HiOutlineMagnifyingGlass
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#2D4CC8]"
          aria-hidden
        />
        <input
          type="text"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search your platform, plugin, ERP or website builder..."
          className={inputClass}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#2D4CC8] transition hover:bg-[#2D4CC8]/10"
          aria-label="Toggle platform options"
        >
          <HiOutlineChevronDown
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </div>

      {open && options.length > 0 ? (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-[#2D4CC8]/20 bg-white py-2 shadow-lg"
        >
          {options.map((option) => (
            <li key={option} role="option" aria-selected={value === option}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(option)}
                className="block w-full px-4 py-2.5 text-left text-sm text-[#13203F] transition hover:bg-[#f2f6fb] hover:text-[#2D4CC8]"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SearchStep({ platformQuery, onPlatformQueryChange, onSelectPlatform, onFind }) {
  const canSearch = platformQuery.trim().length > 0;

  return (
    <section className="bg-[#f2f6fb] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <PlatformSearchField
            value={platformQuery}
            onChange={onPlatformQueryChange}
            onSelect={onSelectPlatform}
          />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-[#13203F]">Popular Platforms</p>
            <PopularPlatformsTable
              selectedPlatform={platformQuery}
              onSelectPlatform={onSelectPlatform}
            />
          </div>

          <button
            type="button"
            disabled={!canSearch}
            onClick={onFind}
            className="mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-6 py-3.5 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            style={{ color: "#fff" }}
          >
            Find Compatible Providers
            <HiArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

function ResultsStep({
  platformName,
  providers,
  onBack,
  onTalkToExpert,
}) {
  const hasResults = providers.length > 0;

  return (
    <section className="bg-[#f2f6fb] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#2D4CC8] transition hover:text-[#13203F]"
        >
          <HiArrowLeft className="size-4" aria-hidden />
          Back to search
        </button>

        {hasResults ? (
          <>
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-[#13203F] sm:text-3xl">Compatible Providers</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                The following providers currently support{" "}
                <span className="font-semibold text-[#13203F]">{platformName}</span> based on publicly
                available information and provider submissions.
              </p>
            </div>

            <div className="relative mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {providers.length > 1 ? (
                <div
                  className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-slate-200 xl:block"
                  aria-hidden
                />
              ) : null}
              {providers.map((firm, index) => (
                <ProviderCard key={firm.name} firm={firm} index={index} />
              ))}
            </div>

            <div className="mt-12 rounded-[28px] border border-[#2D4CC8]/15 bg-gradient-to-br from-[#eff4ff] via-white to-[#ecf9f3] px-6 py-10 text-center sm:px-10">
              <h3 className="text-xl font-bold text-[#13203F] sm:text-2xl">
                Still unsure which provider is right for your business?
              </h3>
              <button
                type="button"
                onClick={onTalkToExpert}
                className="mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-8 py-3.5 text-sm font-semibold text-white shadow-lg"
                style={{ color: "#fff" }}
              >
                Talk to an Expert
                <HiArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">
            <h2 className="text-2xl font-bold text-[#13203F] sm:text-3xl">
              Couldn&apos;t find your platform?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              We&apos;re continuously expanding our database. Tell us what platform you&apos;re using
              and we&apos;ll help you identify suitable payment providers.
            </p>
            <Link
              href="/merchant#merchant-banner-form"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2D4CC8] to-[#40C3CF] px-8 py-3.5 text-sm font-semibold text-white shadow-lg"
              style={{ color: "#fff" }}
            >
              Request Assistance
              <HiArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function PgPluginFinder() {
  const { openTalkToExpert } = useTalkToExpert();
  const [view, setView] = useState("search");
  const [platformQuery, setPlatformQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [providers, setProviders] = useState([]);

  function handleSelectPlatform(platform) {
    setPlatformQuery(platform);
    setSelectedPlatform(platform);
  }

  function handleFind() {
    const resolved = resolvePlatformName(platformQuery);
    if (!resolved) return;

    setSelectedPlatform(resolved);
    setProviders(getProvidersForPlatform(resolved));
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setView("search");
    setProviders([]);
  }

  if (view === "results") {
    return (
      <ResultsStep
        platformName={selectedPlatform}
        providers={providers}
        onBack={handleBack}
        onTalkToExpert={openTalkToExpert}
      />
    );
  }

  return (
    <SearchStep
      platformQuery={platformQuery}
      onPlatformQueryChange={setPlatformQuery}
      onSelectPlatform={handleSelectPlatform}
      onFind={handleFind}
    />
  );
}
