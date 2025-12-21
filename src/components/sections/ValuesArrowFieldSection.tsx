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
        className="grid gap-px overflow-hidden border border-[rgba(206,225,226,1)] sm:grid-cols-3"
      >
        {items.map((item) => (
          <div
            key={item}
            className={clsx(
              "relative flex items-center justify-between bg-white/90 px-6 py-8",
              "transition-colors duration-200 hover:bg-white",
            )}
          >
            <div>
              <p className="text-2xl font-semibold tracking-tight text-gray-900">{item}</p>
            </div>
            <svg
              className="arrow-pointer self-end"
              width="78"
              height="79"
              viewBox="0 0 78 79"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <line x1="75.9434" y1="39.3552" x2="5.79323e-05" y2="39.3552" stroke="currentColor" strokeWidth="2" />
              <line x1="75.2363" y1="39.0623" x2="36.881" y2="0.707122" stroke="currentColor" strokeWidth="2" />
              <line x1="76.6505" y1="39.0623" x2="38.2953" y2="77.4175" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
};

