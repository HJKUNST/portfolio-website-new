"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
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

  const fullText = useMemo(() => `${headline} ${subheadline}`, [headline, subheadline]);
  const headlineLength = headline.length;
  const allLetters = useMemo(() => fullText.split(""), [fullText]);

  // Split into words for word-level line breaking
  const words = useMemo(() => {
    const headlineWords = headline.split(" ");
    const subheadlineWords = subheadline.split(" ");
    return { headlineWords, subheadlineWords };
  }, [headline, subheadline]);

  // useEffect(() => {
  //   const gsap = getGSAP();
  //   if (!gsap || !ScrollTrigger || prefersReducedMotion()) return;
  //   if (!sectionRef.current) return;f

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
    <section ref={sectionRef} className="section-shell flex flex-col items-center justify-center relative overflow-auto" style={{ minHeight: "10vh", background: "transparent", paddingBottom: "6rem" }}>
      <div className="my-6 pb-[8%] flex flex-col items-center">
        <p className="text-h2 text-gray-900 leading-snug w-[70%] mb-8 text-center">
          {words.headlineWords.map((word, wordIdx) => (
            <span key={`headline-word-${wordIdx}`} className="inline-block">
              {word.split("").map((letter, letterIdx) => {
                const globalIdx = words.headlineWords.slice(0, wordIdx).join(" ").length + wordIdx + letterIdx;
                return (
                  <span
                    key={`headline-letter-${wordIdx}-${letterIdx}`}
                    ref={(el) => {
                      if (el) {
                        lettersRef.current[globalIdx] = el;
                      }
                    }}
                    className="inline-block"
                  >
                    {letter}
                  </span>
                );
              })}
              {wordIdx < words.headlineWords.length - 1 && "\u00A0"}
            </span>
          ))}
          {" "}
          {words.subheadlineWords.map((word, wordIdx) => (
            <span key={`subheadline-word-${wordIdx}`} className="inline-block text-h2-em text-secondary align-baseline" style={{ lineHeight: 0.9 }}>
              {word.split("").map((letter, letterIdx) => (
                <span
                  key={`subheadline-letter-${wordIdx}-${letterIdx}`}
                  className="inline-block"
                >
                  {letter}
                </span>
              ))}
              {wordIdx < words.subheadlineWords.length - 1 && "\u00A0"}
            </span>
          ))}
        </p>

        <div ref={ctaRef} className="flex flex-col items-center gap-4">
          <span className="text-h4 uppercase tracking-[0.08em]">
            {contactLabel}
          </span>
          <div className="flex flex-wrap gap-1">
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
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[500px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse 1200px 500px at 50% 100%, rgba(136,195,198,0.4) 0%, rgba(136,195,198,0) 100%)',
          maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
        }}
      />
    </section>
  );
};

