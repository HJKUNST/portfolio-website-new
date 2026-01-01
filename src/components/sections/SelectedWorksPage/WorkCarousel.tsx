"use client";

import { HeroCard, CardWithKey } from "../HeroSection";
import { WorkItem } from "@/lib/works/types";
import { CAROUSEL_GAP } from "@/lib/works/constants";

interface WorkCarouselProps {
  cards: CardWithKey[];
  works: WorkItem[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  carouselRef: React.RefObject<HTMLDivElement | null>;
  onCardHover: (index: number | null) => void;
  getWorkLink: (work: WorkItem) => string | undefined;
}

export const WorkCarousel = ({
  cards,
  works,
  containerRef,
  trackRef,
  carouselRef,
  onCardHover,
  getWorkLink,
}: WorkCarouselProps) => {
  return (
    <div ref={carouselRef} className="flex flex-col">
      <div
        ref={containerRef}
        className="relative overflow-hidden w-full aspect-[4/3] md:aspect-auto md:h-[min(40vh,640px)]"
      >
        <div
          ref={trackRef}
          className="flex h-full items-stretch"
          style={{ gap: CAROUSEL_GAP, width: "max-content" }}
        >
          {cards.map((card, idx) => {
            const work = works[idx];
            const link = getWorkLink(work);
            
            return (
              <div
                key={card._key}
                onMouseEnter={() => onCardHover(idx)}
                onMouseLeave={() => onCardHover(null)}
              >
                <HeroCard
                  card={card}
                  onClick={() => {
                    if (link) {
                      window.open(link, "_blank", "noopener,noreferrer");
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

