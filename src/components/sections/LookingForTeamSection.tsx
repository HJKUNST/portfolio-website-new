"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { ScrollTrigger, getGSAP } from "@/lib/motion/gsap";
import { DEFAULT_EASE, MICRO_FAST, prefersReducedMotion } from "@/lib/motion/constants";

type Props = {
  headline?: string;
  subheadline?: string;
  contactLabel?: string;
  icons?: { href: string; label: string; icon: string }[];
};

// ============================================
// Default Data (기본 데이터)
// ============================================

const DEFAULT_HEADLINE = "I'm looking for a team that builds in that cadence. I bring the machinery, the craft, and the ability";

const DEFAULT_SUBHEADLINE = "to help many hands align toward one clear product.";

const DEFAULT_CONTACT_LABEL = "Contact Me";

const DEFAULT_ICONS = [
  { href: "https://www.linkedin.com/in/laura-hj-kim-a761b8223/", label: "LinkedIn", icon: "/linkedin.svg" },
  { href: "https://github.com/HJKUNST", label: "Github", icon: "/github.svg" },
  { href: "https://t.me/lkkunst1", label: "Telegram", icon: "/telegram.svg" },
  { href: "mailto:lkkunst1@gmail.com", label: "Email", icon: "/mail.svg" },
];

export const LookingForTeamSection = ({
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADLINE,
  contactLabel = DEFAULT_CONTACT_LABEL,
  icons = DEFAULT_ICONS,
}: Props) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const headlineLetters = useMemo(() => headline.split(""), [headline]);

  // useEffect(() => {
  //   const gsap = getGSAP();
  //   if (!gsap || !ScrollTrigger || prefersReducedMotion()) return;
  //   if (!sectionRef.current) return;

  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: sectionRef.current,
  //       start: "top 85%",
  //       end: "top 20%",
  //       toggleActions: "play none none reverse",
  //     },
  //   });

  //   tl.from(lettersRef.current, {
  //     y: -40,
  //     opacity: 0,
  //     stagger: 0.035,
  //     ease: DEFAULT_EASE,
  //     duration: MICRO_FAST + 0.2,
  //   }).from(
  //     ctaRef.current,
  //     { opacity: 0, y: 16, duration: MICRO_FAST },
  //     "-=0.2",
  //   );

  //   return () => {
  //     tl.kill();
  //   };
  // }, []);

  return (
    <section ref={sectionRef} className="section-shell text-center" style={{ minHeight: "40vh" }}>
      <h3 className="text-h2 max-w-5xl mx-auto leading-tight">
        {headlineLetters.map((letter, idx) => {
          const isSpace = letter === " ";
          return (
            <span
              key={`${letter}-${idx}`}
              ref={(el) => {
                if (el && !isSpace) lettersRef.current[idx] = el;
              }}
              className={isSpace ? "" : "inline-block"}
            >
              {isSpace ? "\u00A0" : letter}
            </span>
          );
        })}
      </h3>
      <p className="mt-4 text-h2-em text-secondary">{subheadline}</p>

      <div ref={ctaRef} className="mt-8 flex flex-col items-center gap-4">
        <span className="text-em uppercase tracking-[0.08em] text-gray-300">
          {contactLabel}
        </span>
        <div className="flex items-center gap-1">
          {icons.map((icon) => (
            <a
              key={icon.href}
              href={icon.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-100 bg-[rgba(206,225,226,0.2)] text-gray-900 transition hover:-translate-y-1"
              aria-label={icon.label}
            >
              <Image
                src={icon.icon}
                alt={icon.label}
                width={24}
                height={24}
                className="object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

