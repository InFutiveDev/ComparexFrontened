"use client";

import React, { useEffect, useId, useRef, useState } from "react";

type FadeUpProps = {
  children: React.ReactNode;
  className?: string;
  /** IntersectionObserver threshold */
  threshold?: number;
  /** Root margin (e.g. "0px 0px -10% 0px") */
  rootMargin?: string;
  /** Delay in ms for staggering */
  delayMs?: number;
  /** If true, animate only once */
  once?: boolean;
};

export function FadeUp({
  children,
  className,
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  delayMs = 0,
  once = true,
}: FadeUpProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) {
      const t = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(t);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return (
    <div
      ref={ref}
      data-fade-up={id}
      className={[
        "transition-all duration-700 ease-out will-change-transform",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className ?? "",
      ].join(" ")}
      style={{ transitionDelay: delayMs ? `${delayMs}ms` : undefined }}
    >
      {children}
    </div>
  );
}

