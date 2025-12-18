"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

type Props = {
  headline: string;
  emphasis: string;
};

export const BeliefFillTextSection = ({ headline, emphasis }: Props) => {
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const gsap = getGSAP();
    if (!gsap || !ScrollTrigger || prefersReducedMotion()) return;
    if (!textRef.current) return;

    const el = textRef.current;
    gsap.set(el, { backgroundSize: "0% 100%" });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      onUpdate: (self) => {
        const progress = Math.min(1, Math.max(0, self.progress));
        gsap.to(el, {
          backgroundSize: `${Math.round(progress * 100)}% 100%`,
          duration: 0.2,
        });
      },
    });

    return () => trigger.kill();
  }, []);

  const [before, after] = headline.split(emphasis);
  const safeBefore = before ?? headline;
  const safeAfter = after ?? "";

  return (
    <section className="section-shell">
      <p
        ref={textRef}
        className="w-full text-h2 leading-snug"
        style={{
          backgroundImage: "linear-gradient(90deg, #97B29D, #0B0B0B, #85ADAF)",
          backgroundRepeat: "no-repeat",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {safeBefore}
        <span className="text-h2-em text-secondary align-baseline">{emphasis}</span>
        {safeAfter}
      </p>
    </section>
  );
};

