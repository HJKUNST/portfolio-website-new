"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { createArrowField } from "@/lib/motion/pointer";

type Props = {
  title?: string;
  items?: string[];
};

// ============================================
// Default Data
// ============================================

const DEFAULT_TITLE = "Things that I can add values for you";

const DEFAULT_ITEMS = [
  "User Interface (UI)",
  "Design System",
  "Pitch Deck",
  "UX Research",
  "Landing Page",
  "Brand Guideline",
  "Design Engineering",
  "Interaction Design",
  "More Coming Soon…",
];

export const ValuesArrowFieldSection = ({
  title = DEFAULT_TITLE,
  items = DEFAULT_ITEMS
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateCardHeights = () => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;

      cards.forEach(card => {
        card.style.height = 'auto';
      });

      let maxHeight = 0;
      cards.forEach(card => {
        const height = card.getBoundingClientRect().height;
        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      cards.forEach(card => {
        card.style.height = `${maxHeight}px`;
      });
    };

    updateCardHeights();

    const resizeObserver = new ResizeObserver(updateCardHeights);
    cardsRef.current.forEach(card => {
      if (card) resizeObserver.observe(card);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [items]);

  useEffect(() => {
    if (!containerRef.current) return;
    const nodes = Array.from(
      containerRef.current.querySelectorAll(".arrow-pointer"),
    ) as HTMLElement[];
    const controller = createArrowField(nodes);
    controller.updateCenters();
    return controller.cleanup;
  }, [items]);

  return (
    <section className="section-shell">
      <p
        className="text-h3-em mb-[48px]"
        style={{
          background: "var(--main-gradient)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {`// ${title}`}
      </p>
      <div
        ref={containerRef}
        className="grid overflow-hidden sm:grid-cols-3 border-y border-[rgba(206,225,226,1)] items-stretch"
      >
        {items.map((item, idx) => {
          const isFirstRow = idx < 3;
          const isFirstCol = idx % 3 === 0;
          const isMoreComingSoon = item === "More Coming Soon…";

          return (
            <div
              key={item}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className={clsx(
                "relative flex flex-col justify-between bg-white/10 px-6 py-6 gap-8",
                !isMoreComingSoon && "group",
                !isMoreComingSoon && "hover:[box-shadow:inset_0_0_40px_0_rgba(136,195,198,0.2)]",
                !isMoreComingSoon && "transition-all duration-200 ease-in-out",
                !isFirstRow && "border-t border-[rgba(206,225,226,1)]",
                !isFirstCol && "border-l border-[rgba(206,225,226,1)]",

              )}
              style={{ minHeight: "180px" }}
            >
              <p
                className={clsx(
                  "values-card-text text-h2 text-left leading-snug",
                  "text-[rgba(0,0,0,0.8)]",
                  !isMoreComingSoon && "transition-colors duration-200 ease-in-out",
                  isMoreComingSoon && "opacity-20"
                )}
              >
                {item}
              </p>
              <svg
                className={clsx(
                  "arrow-pointer self-end text-[rgba(133,173,175,1)]",
                  !isMoreComingSoon && "group-hover:!text-[var(--secondary)]",
                  !isMoreComingSoon && "transition-colors duration-200 ease-in-out"
                )}
                width="78"
                height="79"
                viewBox="0 0 78 79"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <line x1="75.9434" y1="39.3552" x2="5.79323e-05" y2="39.3552" stroke="currentColor" strokeWidth="1" />
                <line x1="75.2363" y1="39.0623" x2="36.881" y2="0.707122" stroke="currentColor" strokeWidth="1" />
                <line x1="76.6505" y1="39.0623" x2="38.2953" y2="77.4175" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          );
        })}
      </div>
    </section>
  );
};

