"use client";

import { useEffect, useRef, useState } from "react";
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
  const [activeMobileIndex, setActiveMobileIndex] = useState<number | null>(null);

  // Mobile: Center card detection for "active" state
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setActiveMobileIndex(null);
        return;
      }

      const viewportCenter = window.innerHeight / 2;
      let closestIndex = -1;
      let minDistance = Number.MAX_VALUE;

      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });

      setActiveMobileIndex(closestIndex);
    };

    let animationFrameId: number;
    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [items]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateCardHeights = () => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;

      // 모바일 체크 (768px 미만)
      const isMobile = window.innerWidth < 768;

      cards.forEach(card => {
        card.style.height = 'auto';
      });

      // 모바일에서는 높이를 맞추지 않고 각 카드의 자연스러운 높이 사용
      if (isMobile) {
        return;
      }

      // 데스크톱에서만 높이 맞추기
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
    const handleResize = () => {
      updateCardHeights();
    };

    window.addEventListener('resize', handleResize);
    cardsRef.current.forEach(card => {
      if (card) resizeObserver.observe(card);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
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
    <section className="section-shell" style={{ marginBottom: "none" }}>
      <div style={{ textAlign: "left", width: "100%" }}>
        <p
          className="text-h3-em mb-[48px]"
          style={{
            background: "var(--main-gradient)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "left",
            display: "block",
            width: "100%",
          }}
        >
          {`// ${title}`}
        </p>
      </div>
      <div
        ref={containerRef}
        className="grid overflow-hidden sm:grid-cols-3 border-y border-[rgba(206,225,226,1)] items-stretch"
      >
        {items.map((item, idx) => {
          const isFirstRow = idx < 3;
          const isFirstCol = idx % 3 === 0;
          const isMoreComingSoon = item === "More Coming Soon…";
          const isLastItem = idx === items.length - 1;
          const isActive = idx === activeMobileIndex;

          return (
            <div
              key={item}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className={clsx(
                "relative bg-white/10",
                "flex flex-row items-center sm:flex-col sm:justify-between sm:items-start",
                "px-4 py-4 sm:px-6 sm:py-6",
                "gap-3 sm:gap-8",
                !isMoreComingSoon && "group",
                !isMoreComingSoon && "hover:[box-shadow:inset_0_0_40px_0_rgba(136,195,198,0.2)]",
                // Mobile active state
                isActive && !isMoreComingSoon && "[box-shadow:inset_0_0_40px_0_rgba(136,195,198,0.2)]",
                !isMoreComingSoon && "transition-all duration-200 ease-in-out",
                // 모바일: border-bottom만 (마지막 카드 제외)
                !isLastItem && "border-b border-[rgba(206,225,226,1)] sm:border-b-0",
                // 데스크톱: border-top과 border-left
                !isFirstRow && "sm:border-t sm:border-[rgba(206,225,226,1)]",
                !isFirstCol && "sm:border-l sm:border-[rgba(206,225,226,1)]",

              )}
              style={{ minHeight: "120px" }}
            >
              <p
                className={clsx(
                  "values-card-text text-h2 text-left leading-snug",
                  "flex-1",
                  "text-[rgba(0,0,0,0.8)]",
                  !isMoreComingSoon && "group-hover:!text-[var(--secondary)]",
                  isActive && !isMoreComingSoon && "!text-[var(--secondary)]",
                  !isMoreComingSoon && "transition-colors duration-200 ease-in-out",
                  isMoreComingSoon && "opacity-20"
                )}
              >
                {item}
              </p>
              <svg
                className={clsx(
                  "arrow-pointer text-[rgba(133,173,175,1)]",
                  "flex-shrink-0",
                  "sm:self-end",
                  !isMoreComingSoon && "group-hover:!text-[var(--secondary)]",
                  // Mobile active state
                  isActive && !isMoreComingSoon && "!text-[var(--secondary)]",
                  !isMoreComingSoon && "transition-colors duration-200 ease-in-out"
                )}
                width="40"
                height="40"
                viewBox="0 0 78 79"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                style={{
                  width: "clamp(40px, 8vw, 78px)",
                  height: "clamp(40px, 8vw, 79px)",
                }}
              >
                <line x1="75.9434" y1="39.3552" x2="5.79323e-05" y2="39.3552" stroke="currentColor" strokeWidth="2" />
                <line x1="75.2363" y1="39.0623" x2="36.881" y2="0.707122" stroke="currentColor" strokeWidth="2" />
                <line x1="76.6505" y1="39.0623" x2="38.2953" y2="77.4175" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          );
        })}
      </div>
    </section>
  );
};

