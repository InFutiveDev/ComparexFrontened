"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const cards = [
  {
    id: 1,
    image: "/images/hero-slide-1.svg",
    title: (
      <>
        Explore and Compare <br /> Software
      </>
    ),
    description:
      "Discover and compare software based on pricing, features, and specifications to make informed decisions for your business or personal needs.",
    button: "Compare Software",
    href: "/compare",
  },
  {
    id: 2,
    image: "/images/hero-slide-2.svg",
    title: (
      <>
        Get Expert <br /> Software Advice
      </>
    ),
    description:
      "Experience multiple product demos to find what truly fits your needs. Our experts offer personalised guidance, helping you navigate options with clarity and confidence.",
    button: "Get consultation",
    href: "/contact",
  },
  {
    id: 3,
    image: "/images/hero-slide-3.svg",
    title: "Secure Payments & Transactions",
    description:
      "Get transparent and low pricing options across all software with secure and trusted payment methods. For easier investment, EMI options are available.",
    button: "",
    href: "",
  },
];

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
        const index = Number((visible.target).dataset.index);
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
    <section className="bg-[#eef2fa] py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <div className="relative aspect-square w-full max-w-[570px]">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                    activeCard === card.id - 1 ? "z-10 opacity-100" : "z-0 opacity-0"
                  }`}
                  aria-hidden={activeCard !== card.id - 1}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-full bg-[radial-gradient(circle,_#dfe9fb_0%,_#d8e4fb_35%,_#d3e0fa_70%,_#cfdcf8_100%)]">
                    <div className="absolute inset-[9%] rounded-full border border-[#c6d6f4]/70" />

                

                    <Image
                      src={card.image}
                      alt="Software"
                      fill
                      className="object-cover aspect-square z-50"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                 </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="flex min-h-screen items-center"
                data-index={index}
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
              >
                <div className="max-w-xl">
                  <h2 className="text-4xl font-bold leading-tight text-slate-800 lg:text-5xl">
                    {card.title}
                  </h2>

                  <p className="mt-6 text-lg leading-8 text-slate-600">
                    {card.description}
                  </p>

                  {card.button && card.href && (
                    <Link
                      href={card.href}
                      className="mt-8 inline-flex items-center gap-3 text-lg font-semibold text-[#2668b7] transition hover:text-[#1f5493]"
                    >
                      {card.button}

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="12"
                        viewBox="0 0 8 12"
                        fill="none"
                      >
                        <path
                          d="M7 6.5L2.25 11.25C1.83579 11.6642 1.16421 11.6642 0.75 11.25C0.335787 10.8358 0.335786 10.1642 0.749999 9.75L4.5 6L0.75 2.25C0.335786 1.83579 0.335787 1.16421 0.75 0.75C1.16421 0.335787 1.83579 0.335787 2.25 0.75L7 5.5C7.27614 5.77614 7.27614 6.22386 7 6.5Z"
                          fill="currentColor"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}