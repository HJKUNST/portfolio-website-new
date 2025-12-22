"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { createArrowField } from "@/lib/motion/pointer";

type Props = {
  title?: string;
  items?: string[];
};

// ============================================
// Default Data (기본 데이터)
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
        className="grid overflow-hidden sm:grid-cols-3 border-y border-[rgba(206,225,226,1)]"
      >
        {items.map((item, idx) => {
          const isFirstRow = idx < 3;
          const isFirstCol = idx % 3 === 0;

          return (
            <div
              key={item}
              className={clsx(
                "relative flex flex-col justify-between bg-white/90 min-h-[180px] px-6 py-6 gap-8",
                "transition-colors duration-200 hover:bg-white",
                !isFirstRow && "border-t border-[rgba(206,225,226,1)]",
                !isFirstCol && "border-l border-[rgba(206,225,226,1)]",
              )}
            >
              <p className="text-h2 text-left leading-snug" style={{ color: "rgba(0,0,0,0.8)" }}>{item}</p>
              <svg
                className="arrow-pointer self-end"
                width="78"
                height="79"
                viewBox="0 0 78 79"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <line x1="75.9434" y1="39.3552" x2="5.79323e-05" y2="39.3552" stroke="rgba(206,225,226,1)" strokeWidth="1" />
                <line x1="75.2363" y1="39.0623" x2="36.881" y2="0.707122" stroke="rgba(206,225,226,1)" strokeWidth="1" />
                <line x1="76.6505" y1="39.0623" x2="38.2953" y2="77.4175" stroke="rgba(206,225,226,1)" strokeWidth="1" />
              </svg>
            </div>
          );
        })}
      </div>
    </section>
  );
};

