"use client";

import { useEffect, useMemo, useRef } from "react";
import { ScrollTrigger, getGSAP } from "@/lib/motion/gsap";
import { DEFAULT_EASE, MICRO_FAST, prefersReducedMotion } from "@/lib/motion/constants";

type Props = {
  headline: string;
  subheadline: string;
  contactLabel: string;
  icons: { href: string; label: string; icon: string }[];
};

export const LookingForTeamSection = ({
  headline,
  subheadline,
  contactLabel,
  icons,
}: Props) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const headlineLetters = useMemo(() => headline.split(""), [headline]);

  useEffect(() => {
    const gsap = getGSAP();
    if (!gsap || !ScrollTrigger || prefersReducedMotion()) return;
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(lettersRef.current, {
      y: -40,
      opacity: 0,
      stagger: 0.035,
      ease: DEFAULT_EASE,
      duration: MICRO_FAST + 0.2,
    }).from(
      ctaRef.current,
      { opacity: 0, y: 16, duration: MICRO_FAST },
      "-=0.2",
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-shell text-center">
      <h3 className="text-h2 max-w-5xl mx-auto leading-tight">
        {headlineLetters.map((letter, idx) => (
          <span
            key={`${letter}-${idx}`}
            ref={(el) => {
              if (el) lettersRef.current[idx] = el;
            }}
            className="inline-block"
          >
            {letter}
          </span>
        ))}
      </h3>
      <p className="mt-4 text-h2-em text-secondary">{subheadline}</p>

      <div ref={ctaRef} className="mt-8 flex flex-col items-center gap-4">
        <span className="text-em uppercase tracking-[0.08em] text-gray-300">
          {contactLabel}
        </span>
        <div className="flex items-center gap-4">
          {icons.map((icon) => (
            <a
              key={icon.href}
              href={icon.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-900 shadow-md transition hover:-translate-y-1"
              aria-label={icon.label}
            >
              {icon.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

