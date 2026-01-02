"use client";

import { forwardRef } from "react";
import { WorkItem } from "@/lib/works/types";
import { TimelineItem } from "./TimelineItem";
import { SectionSubtitle } from "./SectionSubtitle";
import clsx from "clsx";

interface TimelineListProps {
  works: WorkItem[];
  isMobile: boolean;
  listContainerRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: React.RefObject<(HTMLDivElement | null)[]>;
  getIsActive: (idx: number) => boolean;
  onItemClick: (idx: number) => void;
  onItemMouseEnter: (idx: number) => void;
  onItemMouseLeave: () => void;
  onItemFocus: (e: React.FocusEvent<HTMLDivElement>) => void;
  timelineSubtitleRef: React.RefObject<HTMLHeadingElement | null>;
}

export const TimelineList = forwardRef<HTMLDivElement, TimelineListProps>(
  ({
    works,
    isMobile,
    listContainerRef,
    itemRefs,
    getIsActive,
    onItemClick,
    onItemMouseEnter,
    onItemMouseLeave,
    onItemFocus,
    timelineSubtitleRef,
  }) => {
    return (
      <div className="relative mb-8">
        <SectionSubtitle
          ref={timelineSubtitleRef}
          className="text-left !text-h3-em my-12"
          style={{
            background: "var(--main-gradient)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Timeline
        </SectionSubtitle>
        <div
          ref={listContainerRef}
          className={clsx(
            "gap-12 grid justify-end pl-4 pr-4",
            isMobile ? "" : "overflow-y-auto custom-scrollbar"
          )}
          style={{
            direction: "rtl",
            scrollbarGutter: isMobile ? "auto" : "stable",
            maxHeight: isMobile ? "auto" : "clamp(400px, 36vh, 600px)",
          }}
        >
          {works.map((work, idx) => (
            <TimelineItem
              key={work.id}
              ref={(el) => {
                if (itemRefs.current) {
                  itemRefs.current[idx] = el;
                }
              }}
              work={work}
              index={idx}
              isActive={getIsActive(idx)}
              onClick={() => onItemClick(idx)}
              onMouseEnter={() => onItemMouseEnter(idx)}
              onMouseLeave={onItemMouseLeave}
              onFocus={onItemFocus}
            />
          ))}
        </div>
        {/* Gradient overlay - 스크롤 방향(아래쪽)에 페이드 효과 */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "20%",
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0%) 0%, rgba(255, 255, 255, 40%) 100%)",
          }}
        />
      </div>
    );
  }
);
TimelineList.displayName = "TimelineList";

