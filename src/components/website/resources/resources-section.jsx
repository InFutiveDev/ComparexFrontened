"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  HiAcademicCap,
  HiArrowRight,
  HiChartBarSquare,
  HiNewspaper,
  HiTrophy,
} from "react-icons/hi2";

const resourceCategories = [
  {
    id: "blogs-news",
    tabLabel: "Blogs & News",
    title: "Blogs & News",
    description:
      "Stay updated with payment industry insights, product updates, and expert commentary on India's payment ecosystem.",
    Icon: HiNewspaper,
    activeTab: "bg-[#2D4CC8] text-white",
    badgeColor: "bg-[#2D4CC8]",
    buttonClass:
      "border-[#2D4CC8] text-[#2D4CC8] hover:bg-[#2D4CC8] hover:text-white",
    browseLabel: "Browse All Blogs & News",
    browseHref: "/resources/blogs",
    posts: [
      {
        title: "How to compare payment gateways in 2026",
        date: "June 10, 2026",
        type: "Blog",
        href: "/resources/blogs",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "UPI settlement rule changes explained for merchants",
        date: "May 28, 2026",
        type: "News",
        href: "/resources/news",
        image:
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Razorpay vs Cashfree: what growing businesses should know",
        date: "May 15, 2026",
        type: "Blog",
        href: "/resources/blogs",
        image:
          "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "learning-center",
    tabLabel: "Learning Center",
    title: "Learning Center",
    description:
      "Guides, tutorials, and explainers to help you understand payment gateways, MDR, settlements, and integrations.",
    Icon: HiAcademicCap,
    activeTab: "bg-[#25A36F] text-white",
    badgeColor: "bg-[#25A36F]",
    buttonClass:
      "border-[#25A36F] text-[#25A36F] hover:bg-[#25A36F] hover:text-white",
    browseLabel: "Explore Learning Center",
    browseHref: "/resources/learning-center",
    posts: [
      {
        title: "What is MDR and how is it calculated?",
        date: "June 5, 2026",
        type: "Guide",
        href: "/resources/learning-center",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Understanding T+1 vs instant settlement",
        date: "May 20, 2026",
        type: "Guide",
        href: "/resources/learning-center",
        image:
          "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Payment gateway integration checklist for developers",
        date: "May 8, 2026",
        type: "Tutorial",
        href: "/resources/learning-center",
        image:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "success-stories",
    tabLabel: "Success Stories",
    title: "Merchant Success Stories",
    description:
      "Real stories from Indian businesses who found the right payment partner with CompareX.",
    Icon: HiTrophy,
    activeTab: "bg-[#0891b2] text-white",
    badgeColor: "bg-[#0891b2]",
    buttonClass:
      "border-[#0891b2] text-[#0891b2] hover:bg-[#0891b2] hover:text-white",
    browseLabel: "Read All Success Stories",
    browseHref: "/testimonials/merchant-success-stories",
    posts: [
      {
        title: "SaaS startup scales payments with CompareX",
        date: "Bangalore · SaaS",
        type: "Success Story",
        href: "/testimonials/merchant-success-stories",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Retail chain reduces processing costs across stores",
        date: "Delhi NCR · Retail",
        type: "Success Story",
        href: "/testimonials/merchant-success-stories",
        image:
          "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "E-commerce founder switches gateway with confidence",
        date: "Mumbai · E-commerce",
        type: "Success Story",
        href: "/testimonials/merchant-success-stories",
        image:
          "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  {
    id: "case-studies",
    tabLabel: "Case Studies",
    title: "Case Studies",
    description:
      "In-depth looks at how businesses compared, switched, and scaled with the right payment gateway.",
    Icon: HiChartBarSquare,
    activeTab: "bg-[#2D4CC8] text-white",
    badgeColor: "bg-[#13203F]",
    buttonClass:
      "border-[#13203F] text-[#13203F] hover:bg-[#13203F] hover:text-white",
    browseLabel: "View All Case Studies",
    browseHref: "/testimonials/case-studies",
    posts: [
      {
        title: "B2B manufacturer cuts transaction fees by 18%",
        date: "Ahmedabad · Manufacturing",
        type: "Case Study",
        href: "/testimonials/case-studies",
        image:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "D2C brand improves checkout success rate",
        date: "Pune · D2C",
        type: "Case Study",
        href: "/testimonials/case-studies",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Marketplace onboarding timeline reduced by 40%",
        date: "Hyderabad · Marketplace",
        type: "Case Study",
        href: "/testimonials/case-studies",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
];

function ResourceCard({ title, date, type, href, image, badgeColor, buttonClass }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${badgeColor}`}
        >
          {type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h4 className="text-base font-bold leading-snug text-slate-900 sm:text-lg">{title}</h4>
        <p className="mt-2 text-sm text-slate-500">{date}</p>

        <div className="mt-auto pt-5">
          <Link
            href={href}
            className={`inline-flex items-center justify-center rounded-lg border-2 bg-white px-5 py-2 text-sm font-semibold transition ${buttonClass}`}
          >
            Read more
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ResourcesSection() {
  const [activeTab, setActiveTab] = useState(resourceCategories[0].id);
  const activeCategory =
    resourceCategories.find((category) => category.id === activeTab) ?? resourceCategories[0];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-md bg-[#E8F5EE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1a7a52]">
            Explore Resources
          </span>
          <h2 className="mt-5 text-3xl font-medium leading-[1.15] tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to make{" "}
            <em className="italic text-slate-800">smarter payment decisions</em>
          </h2>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
          {resourceCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveTab(category.id)}
              className={`inline-flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold transition sm:min-w-[140px] sm:px-4 sm:text-sm ${
                activeTab === category.id
                  ? category.activeTab
                  : "text-slate-700 hover:bg-white hover:shadow-sm"
              }`}
            >
              <category.Icon className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{category.tabLabel}</span>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 ">
          

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeCategory.posts.map((post) => (
              <ResourceCard
                key={post.title}
                {...post}
                badgeColor={activeCategory.badgeColor}
                buttonClass={activeCategory.buttonClass}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center sm:justify-center">
            <Link
              href={activeCategory.browseHref}
              className="group inline-flex items-center bg-[#2D4CC8] border border-slate-200 rounded-lg px-4 py-2 gap-2 text-sm font-semibold !text-white transition hover:text-[#2542b6] hover:bg-[#25a36f]"
            >
              {activeCategory.browseLabel}
              <HiArrowRight
                className="size-4 transition group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
