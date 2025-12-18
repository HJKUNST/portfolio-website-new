"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { createArrowField } from "@/lib/motion/pointer";

type Props = {
  title: string;
  items: string[];
};

export const ValuesArrowFieldSection = ({ title, items }: Props) => {
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
      <p className="text-h4-em mb-2">{`// ${title}`}</p>
      <div
        ref={containerRef}
        className="grid gap-px overflow-hidden rounded-2xl border border-gray-100/80 bg-gray-100/30 sm:grid-cols-3"
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
            <span
              className="arrow-pointer relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-900 shadow-inner"
              aria-hidden
            >
              ➜
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

