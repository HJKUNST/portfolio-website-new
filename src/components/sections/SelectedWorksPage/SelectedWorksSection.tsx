"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { HeroCard, CarouselNav, CardWithKey } from "../HeroSection";
import { works } from "@/lib/works/data";
import { WorkItem } from "@/lib/works/types";
import { TitleStyle, BodyStyle } from "@/lib/works/constants";
import { useCarousel } from "@/hooks/useCarousel";
import { useTimeline } from "@/hooks/useTimeline";
import { usePageAnimations } from "@/hooks/usePageAnimations";
import { TimelineList } from "./TimelineList";
import { WorkCarousel } from "./WorkCarousel";

export const SelectedWorksSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Section Refs for Animation
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const timelineSubtitleRef = useRef<HTMLHeadingElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Data Preparation
  const carouselCards = useMemo<CardWithKey[]>(() => {
    return works.map((work) => ({
      title: work.title,
      subtitle: work.subtitle || "",
      tags: work.tags || [],
      image: work.image,
      _key: `work-card-${work.id}`,
    }));
  }, []);

  // Get link for each work (portfolioLink 우선, 없으면 websiteLink)
  const getWorkLink = useCallback((work: WorkItem) => {
    return work.portfolioLink || work.websiteLink || undefined;
  }, []);

  // Carousel Hook
  const {
    currentIndex,
    cardWidth,
    isDesktop,
    containerRef,
    trackRef,
    goToIndex,
    goNext,
    goPrev,
    isAtStart,
    isAtEnd,
  } = useCarousel({
    totalCards: carouselCards.length,
    isMobile,
  });

  // Timeline Hook
  const {
    hoveredIndex,
    setHoveredIndex,
    listContainerRef,
    itemRefs,
    handleItemClick,
    handleItemMouseEnter,
    handleItemMouseLeave,
    handleItemFocus,
    getIsActive,
  } = useTimeline({
    totalItems: works.length,
    currentIndex,
    isMobile,
    onItemClick: goToIndex,
  });

  // Page Animations Hook
  usePageAnimations({
    sectionRef,
    titleRef,
    descriptionRef,
    timelineSubtitleRef,
    carouselRef,
    itemRefs,
  });

  return (
    <section
      ref={sectionRef}
      className="section-shell max-w-[1280px] mx-auto pb-24 px-5 md:px-10 flex flex-col gap-4"
      style={{ background: "#FCFCFC", paddingTop: "120px" }}
    >
      {/* Top Section: Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 items-start">
        {/* Left: Title & Description */}
        <div>
          <h1 ref={titleRef} className="text-h1-gradient mb-4" style={TitleStyle}>
            Selected Works
          </h1>
          <p
            ref={descriptionRef}
            className="text-em"
            style={{
              ...BodyStyle,
              maxWidth: isDesktop && cardWidth > 0 ? `${cardWidth}px` : "100%",
            }}
          >
            I design clarity for complex financial products—across interfaces, data, and performance. Excited about what we can build together.
          </p>
        </div>

        {/* Right: Work List with Highlighting */}
        <div className="md:text-right md:flex md:flex-col md:items-end">
          <TimelineList
            works={works}
            isMobile={isMobile}
            listContainerRef={listContainerRef}
            itemRefs={itemRefs}
            getIsActive={getIsActive}
            onItemClick={handleItemClick}
            onItemMouseEnter={handleItemMouseEnter}
            onItemMouseLeave={handleItemMouseLeave}
            onItemFocus={handleItemFocus}
            timelineSubtitleRef={timelineSubtitleRef}
          />
        </div>
      </div>

      {/* Bottom Section: Carousel */}
      <div className="flex flex-col gap-2">
        <WorkCarousel
          cards={carouselCards}
          works={works}
          containerRef={containerRef}
          trackRef={trackRef}
          carouselRef={carouselRef}
          onCardHover={setHoveredIndex}
          getWorkLink={getWorkLink}
        />

        {/* Navigation */}
        <CarouselNav
          onPrev={goPrev}
          onNext={goNext}
          isAtStart={isAtStart}
          isAtEnd={isAtEnd}
        />
      </div>
    </section>
  );
};

