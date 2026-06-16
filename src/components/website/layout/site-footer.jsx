import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { FooterLegalBar } from "@/components/website/layout/footer-legal-bar";

const routes = {
  home: "/",
};

const footerColumns = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/why-comparex", label: "Why CompareX" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact Us" },
      { href: "/#merchant-assistance-desk", label: "Merchant Support" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/how-it-works", label: "How it Works" },
      { href: "/compare-pg", label: "Compare PG" },
      { href: "/talk-to-expert", label: "Talk to Expert" },
      { href: "/pg-marketplace", label: "PG Marketplace Directory" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/tools/pg-mdr-calculator", label: "PG Cost (MDR) Calculator" },
      { href: "/tools/pg-assessment", label: "PG Assessment" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resources/blogs", label: "Blogs" },
      { href: "/resources/learning-center", label: "Learning Center" },
      { href: "/resources/news", label: "News" },
    ],
  },
  {
    title: "Testimonials",
    links: [
      { href: "/testimonials/reviews-and-ratings", label: "Reviews & Ratings" },
      { href: "/testimonials/merchant-success-stories", label: "Merchant Success Stories" },
      { href: "/testimonials/case-studies", label: "Case Studies" },
    ],
  },
];

const socialLinks = [
  { href: "#", label: "Facebook", icon: FaFacebookF },
  { href: "#", label: "Twitter", icon: FaXTwitter },
  { href: "#", label: "LinkedIn", icon: FaLinkedinIn },
  { href: "#", label: "YouTube", icon: FaYoutube },
];

export function SiteFooter() {
  return (
    <footer>
      <section className="bg-slate-50">
        <div className="relative mx-auto overflow-hidden bg-neutral-100 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.45]"
            aria-hidden
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0, transparent 26px, rgba(0, 0, 0, 0.04) 26px, rgba(0,0,0,0.045) 27px)",
            }}
          />

          <div className="relative flex flex-col gap-12 lg:flex-row lg:items-stretch lg:gap-0">
            <div className="max-w-xl shrink-0 border-b border-neutral-200 pb-10 lg:max-w-[min(100%,28rem)] lg:border-b-0 lg:pb-0 lg:pr-10 xl:pr-14">
              <Link href={routes.home} className="inline-block">
                <Image
                  src="/images/logo.svg"
                  alt="Comparex"
                  width={160}
                  height={40}
                  className="h-11 w-auto object-contain object-left"
                />
              </Link>
              <p className="mt-5 text-base font-medium leading-relaxed text-neutral-600">
                Compare payment gateways side by side, get expert guidance, and activate faster with CompareX managing
                your journey end-to-end.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:text-neutral-950"
                  >
                    <Icon className="h-[1.05rem] w-[1.05rem]" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10 sm:gap-y-10 lg:grid-cols-5 lg:gap-x-0 lg:gap-y-0">
              {footerColumns.map((column) => (
                <div key={column.title} className="min-w-0 lg:px-4 xl:px-5">
                  <h4 className="text-[18px] font-semibold tracking-tight text-neutral-700 sm:text-[20px]">
                    {column.title}
                  </h4>
                  <ul className="mt-5 space-y-3.5">
                    {column.links.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-sm font-semibold text-neutral-950 transition hover:!text-[#0a27c9] sm:text-base"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FooterLegalBar />
    </footer>
  );
}
