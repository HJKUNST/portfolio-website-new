"use client";

import { useEffect, useLayoutEffect, useRef, forwardRef, useState, useMemo, useCallback } from "react";
import { getGSAP, ScrollTrigger } from "@/lib/motion/gsap";
import { HeroCard, CarouselNav, CardWithKey } from "./HeroSection";
import { prefersReducedMotion } from "@/lib/motion/constants";
import clsx from "clsx";

const TitleStyle = {
  fontFamily: "var(--font-manrope), Manrope, sans-serif",
  fontSize: "clamp(28px, 3.5vw, 40px)",
  fontWeight: 500,
  letterSpacing: "-0.02em",
  lineHeight: "1.4em",
};

const BodyStyle = {
  color: "var(--gray-300)",
  lineHeight: "1.4em",
  fontSize: "clamp(16px, 1.6vw, 20px)",
};

const subtitleStyle = {
  fontFamily: "var(--font-manrope), Manrope, sans-serif",
  fontSize: "clamp(18px, 1.6vw, 20px)",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: "1.4em",
  color: "var(--gray-900)",
};

// Reusable Components
const SectionSubtitle = forwardRef<HTMLHeadingElement, {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}>(({ children, className = "", style = {} }, ref) => (
  <h3 ref={ref} className={`text-h3-em mb-3 ${className}`} style={{ ...subtitleStyle, ...style }}>
    {children}
  </h3>
));
SectionSubtitle.displayName = "SectionSubtitle";

const SectionBody = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={`text-em ${className}`} style={BodyStyle}>
    {children}
  </p>
);

type WorkItem = {
  id: string;
  year: string;
  title: string;
  description?: string;
  image: string;
  tags?: string[];
  subtitle?: string;
  link?: string;
  websiteLink?: string;
  portfolioLink?: string;
};

const works: WorkItem[] = [
  {
    id: "eisen-finance",
    year: "'25",
    title: "EISEN Finance",
    description:
      "I joined a crypto-native DeFi startup as a product designer and led a full redesign of the interface and visual identity as the product grew. By focusing on usability, I helped scale daily trading volume from $30K to over $10M.",
    image: "/eisen app.png",
    tags: ["UI/UX", "Design Engineering"],
    subtitle: "Onchain + CEX Trading Interface Made Clear",
    websiteLink: "https://eisenfinance.com",
    portfolioLink:
      "https://www.behance.net/gallery/237416537/EISEN-On-Chain-CEX-Trading-Interface-Made-Clear",
  },
  {
    id: "graphics-data-performance",
    year: "'25",
    title: "Works of Eisen: Graphics, Data, Performance",
    description:
      "My role went beyond design in a mostly developer-led team. I set up ways to talk with users, collect feedback, and organize data, leading the Scroll NFT campaign with 80K+ mints, $40M+ volume, and 90+ partner integrations.",
    image: "/eisen graphic.png",
    tags: [
      "Graphic Design",
      "Brand Experience",
      "Performance Marketing",
      "Data Visualization",
    ],
    subtitle: "Works of Eisen",
    websiteLink: "https://eisenfinance.com",
    portfolioLink:
      "https://www.behance.net/gallery/238318203/Works-of-Eisen-Graphics-Data-Performance",
  },
  {
    id: "tgif",
    year: "'25",
    title: "TGIF - Hedging the FX Market",
    description:
      "Handled the UX/UI and pitch deck for TGIF, a KRW-stablecoin hedging protocol. It won 2nd place by clearly explaining the product's value proposition to the target market.",
    image: "/tgif.png",
    tags: ["UI", "Brand Experience", "Pitch Deck"],
    subtitle: "KRW native stables to hedge FX risk",
    websiteLink: "https://kaia-tgif.vercel.app/",
    portfolioLink: "https://drive.google.com/file/d/1JTIhrKcO72kpZVh0zfVRopRDPfOtLt54/view?usp=sharing",
  },
  {
    id: "hodl-bot",
    year: "'25",
    title: "HODL Bot - Unified Trading Assistant",
    description:
      "I designed the UX and created the entire pitch deck for HODL Bot, a Telegram-based delta-neutral trading tool. The project won 3rd place, recognized for its strong market analysis and clear product direction.",
    image: "/hodl.png",
    tags: ["User Experience", "Brand Experience", "Pitch Deck"],
    subtitle: "Telegram based delta-neutral trading bot",
    websiteLink: "https://t.me/hl_awesome_bot",
    portfolioLink: "https://layers.to/layers/cmg7j8z480008ky09owycshwp-hodl-bot-unified-telegram-trading-risk-management",
  },
  {
    id: "placeholder",
    year: "??",
    title: "(^=˃ᆺ˂) Please wait for more works...",
    image: "",
    tags: [],
    subtitle: "(^=˃ᆺ˂) Please wait for more works...",
  },
];

// Carousel Constants
const GAP = 2;
const WHEEL_COOLDOWN_MS = 500;
const ANIMATION_DURATION = 0.5;

export const SelectedWorksSection = () => {
  // Navigation State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Section Refs for Animation
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const timelineSubtitleRef = useRef<HTMLHeadingElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Carousel Refs & State
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // List Refs
  const listContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- Data Preparation ---
  const carouselCards = useMemo<CardWithKey[]>(() => {
    return works.map((work, idx) => ({
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

  const totalCards = carouselCards.length;
  const itemWidth = cardWidth + GAP;

  // Calculate Navigation Bounds
  const trackTotalWidth = totalCards * itemWidth;
  const maxScrollWidth = Math.max(0, trackTotalWidth - containerWidth);
  const maxIndexFloat = itemWidth > 0 ? maxScrollWidth / itemWidth : 0;
  const lastIndex = Math.max(0, Math.ceil(maxIndexFloat));

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= lastIndex;

  // --- Carousel Logic (Adapted from HeroSection) ---

  const setPositionInstant = useCallback(
    (index: number) => {
      if (!trackRef.current || itemWidth === 0) return;

      const cardW = itemWidth - GAP;
      const centerOffset = (containerWidth - cardW) / 2;
      let x = centerOffset - index * itemWidth;

      x = Math.max(x, -index * itemWidth); // Left Visibility
      x = Math.min(x, 0); // Start Boundary
      x = Math.max(x, -maxScrollWidth); // End Boundary

      const gsap = getGSAP();
      if (gsap) {
        gsap.set(trackRef.current, { x });
      } else {
        trackRef.current.style.transform = `translateX(${x}px)`;
      }
    },
    [itemWidth, maxScrollWidth, containerWidth]
  );

  const animateToIndex = useCallback(
    (index: number, onComplete?: () => void) => {
      if (!trackRef.current || itemWidth === 0) return;

      const cardW = itemWidth - GAP;
      const centerOffset = (containerWidth - cardW) / 2;
      let x = centerOffset - index * itemWidth;

      x = Math.max(x, -index * itemWidth); // Left Visibility
      x = Math.min(x, 0); // Start Boundary
      x = Math.max(x, -maxScrollWidth); // End Boundary

      const gsap = getGSAP();
      if (!gsap || prefersReducedMotion()) {
        setPositionInstant(index);
        onComplete?.();
        return;
      }

      gsap.to(trackRef.current, {
        x,
        duration: ANIMATION_DURATION,
        ease: "power2.out",
        onComplete,
      });
    },
    [itemWidth, setPositionInstant, maxScrollWidth, containerWidth]
  );

  const goToIndex = useCallback(
    (newIndex: number) => {
      if (isTransitioningRef.current || totalCards === 0) return;

      const clampedIndex = Math.max(0, Math.min(newIndex, lastIndex));
      if (clampedIndex === currentIndex) return;

      isTransitioningRef.current = true;

      animateToIndex(clampedIndex, () => {
        setCurrentIndex(clampedIndex);
        isTransitioningRef.current = false;
      });
    },
    [totalCards, lastIndex, currentIndex, animateToIndex]
  );

  const goNext = useCallback(() => goToIndex(currentIndex + 1), [goToIndex, currentIndex]);
  const goPrev = useCallback(() => goToIndex(currentIndex - 1), [goToIndex, currentIndex]);

  // Handle Dimension Updates
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const height = containerRef.current.offsetHeight;
      const width = containerRef.current.offsetWidth;
      setCardWidth(Math.round(height * (4 / 3)));
      setContainerWidth(width);
      setIsDesktop(window.innerWidth >= 768);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  /** 초기 위치 설정 */
  useLayoutEffect(() => {
    if (carouselCards.length > 0 && cardWidth > 0) {
      setPositionInstant(0);
    }
  }, [carouselCards.length, cardWidth, setPositionInstant]);

  /** 리사이즈 시 현재 위치 유지 */
  useEffect(() => {
    if (cardWidth > 0) {
      setPositionInstant(currentIndex);
    }
  }, [cardWidth, currentIndex, setPositionInstant]);

  /** 휠 스크롤로 캐러셀 탐색 (Desktop only) */
  useEffect(() => {
    if (isMobile) return; // Disable wheel scroll on mobile

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // 가로 스크롤은 무시
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();

      // 쿨다운 체크
      const now = Date.now();
      if (now - lastWheelTimeRef.current < WHEEL_COOLDOWN_MS) return;
      if (isTransitioningRef.current) return;

      lastWheelTimeRef.current = now;

      if (e.deltaY > 0) goNext();
      else if (e.deltaY < 0) goPrev();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev, isMobile]);

  // Auto-scroll list when currentIndex changes (Desktop only)
  useEffect(() => {
    if (isMobile) return;

    const list = listContainerRef.current;
    if (!list) return;

    const activeItem = itemRefs.current[currentIndex];
    if (!activeItem) return;

    const listHeight = list.clientHeight;
    const itemTop = activeItem.offsetTop;
    const itemHeight = activeItem.offsetHeight;

    const targetScroll = itemTop - listHeight / 2 + itemHeight / 2;

    const gsap = getGSAP();
    if (gsap && !prefersReducedMotion()) {
      gsap.to(list, {
        scrollTop: targetScroll,
        duration: 0.6,
        ease: "power3.out",
        overwrite: true,
      });
    } else {
      list.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, [currentIndex, isMobile]);

  // Page Transition Animation (Same as AboutMePage)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current) return;

    const gsap = getGSAP();
    if (!gsap || !ScrollTrigger) return;

    const mm = gsap.matchMedia();

    // Title animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Description animation
    if (descriptionRef.current) {
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Timeline subtitle animation
    if (timelineSubtitleRef.current) {
      gsap.fromTo(
        timelineSubtitleRef.current,
        { opacity: 0.2 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineSubtitleRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }

    // Work list items animation (Desktop only)
    mm.add("(min-width: 768px)", () => {
      itemRefs.current.forEach((ref) => {
        if (!ref) return;
        gsap.fromTo(
          ref,
          { opacity: 0.2 },
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    });

    // Carousel section animation
    if (carouselRef.current) {
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger && itemRefs.current.includes(trigger.vars.trigger as HTMLDivElement)) {
          trigger.kill();
        }
      });
    };
  }, []);

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
                isMobile ? "" : "overflow-y-auto max-h-[320px] custom-scrollbar"
              )}
              style={{
                direction: "rtl",
                scrollbarGutter: isMobile ? "auto" : "stable",
              }}
            >
              {works.map((work, idx) => {
                // 데스크탑에서는 hover/active에 따라 opacity 변화
                const isActive = !isMobile && (hoveredIndex !== null ? idx === hoveredIndex : idx === currentIndex);

                // 스크롤하여 항목이 보이도록 하는 함수 (Desktop only)
                const scrollIntoViewIfNeeded = (element: HTMLDivElement | null) => {
                  if (isMobile || !element || !listContainerRef.current) return;

                  const container = listContainerRef.current;
                  const gsap = getGSAP();

                  const containerRect = container.getBoundingClientRect();
                  const elementRect = element.getBoundingClientRect();

                  const padding = 20;
                  const isAbove = elementRect.top < containerRect.top + padding;
                  const isBelow = elementRect.bottom > containerRect.bottom - padding;

                  if (isAbove || isBelow) {
                    const elementOffsetTop = element.offsetTop;
                    const containerHeight = container.clientHeight;
                    const elementHeight = element.offsetHeight;

                    const targetScrollTop = elementOffsetTop - (containerHeight / 2) + (elementHeight / 2);
                    const maxScroll = container.scrollHeight - containerHeight;
                    const clampedScrollTop = Math.max(0, Math.min(targetScrollTop, maxScroll));

                    if (gsap && !prefersReducedMotion()) {
                      gsap.to(container, {
                        scrollTop: clampedScrollTop,
                        duration: 0.5,
                        ease: "power2.out",
                        overwrite: true,
                      });
                    } else {
                      container.scrollTo({
                        top: clampedScrollTop,
                        behavior: "smooth",
                      });
                    }
                  }
                };

                return (
                  <div
                    key={work.id}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    className={clsx(
                      "cursor-pointer text-left",
                      !isMobile && "transition-opacity duration-300",
                      !isMobile && (isActive ? "opacity-100" : "opacity-30")
                    )}
                    style={{ direction: "ltr" }}
                    onClick={() => {
                      if (!isMobile) {
                        goToIndex(idx);
                        scrollIntoViewIfNeeded(itemRefs.current[idx]);
                      }
                    }}
                    onMouseEnter={() => {
                      if (!isMobile) {
                        setHoveredIndex(idx);
                        scrollIntoViewIfNeeded(itemRefs.current[idx]);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isMobile) {
                        setHoveredIndex(null);
                      }
                    }}
                    onFocus={(e) => {
                      if (!isMobile) {
                        scrollIntoViewIfNeeded(e.currentTarget);
                      }
                    }}
                  >
                    <div className="flex gap-3 mb-3 items-start">
                      <span
                        className="text-em"
                        style={{
                          ...BodyStyle,
                          color: "var(--gray-900)",
                          fontWeight: 500,
                          minWidth: "33px",
                        }}
                      >
                        {work.year}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {work.link ? (
                          <a
                            href={work.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity inline-flex items-center focus:outline-none"
                          >
                            <h3
                              className="text-h3-em !font-medium !mb-0 inline-block"
                              style={isActive ? {
                                background: "var(--main-gradient)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                color: "transparent",
                                fontFamily: "var(--font-manrope), Manrope, sans-serif",
                                fontSize: "clamp(18px, 1.6vw, 20px)",
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                lineHeight: "1.4em",
                              } : {
                                fontFamily: "var(--font-manrope), Manrope, sans-serif",
                                fontSize: "clamp(18px, 1.6vw, 20px)",
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                lineHeight: "1.4em",
                                color: "var(--gray-900)",
                              }}
                            >
                              {work.title}
                            </h3>
                          </a>
                        ) : (
                          <h3
                            className="text-h3-em !font-medium !mb-0 inline-block"
                            style={isActive ? {
                              background: "var(--main-gradient)",
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              color: "transparent",
                              fontFamily: "var(--font-manrope), Manrope, sans-serif",
                              fontSize: "clamp(18px, 1.6vw, 20px)",
                              fontWeight: 700,
                              letterSpacing: "-0.02em",
                              lineHeight: "1.4em",
                            } : {
                              fontFamily: "var(--font-manrope), Manrope, sans-serif",
                              fontSize: "clamp(18px, 1.6vw, 20px)",
                              fontWeight: 700,
                              letterSpacing: "-0.02em",
                              lineHeight: "1.4em",
                              color: "var(--gray-900)",
                            }}
                          >
                            {work.title}
                          </h3>
                        )}
                        {(work.websiteLink || work.portfolioLink) && (
                          <span className="text-em inline-flex items-center" style={{ ...BodyStyle, color: "var(--gray-300)" }}>
                            |
                          </span>
                        )}
                        {work.websiteLink && (
                          <a
                            href={work.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-em hover:opacity-80 transition-opacity inline-flex items-center focus:outline-none"
                            style={{
                              ...BodyStyle,
                              color: "var(--gray-300)",
                              textDecoration: "underline",
                            }}
                          >
                            Website
                          </a>
                        )}
                        {work.websiteLink && work.portfolioLink && (
                          <span className="text-em inline-flex items-center" style={{ ...BodyStyle, color: "var(--gray-300)" }}>
                            |
                          </span>
                        )}
                        {work.portfolioLink && (
                          <a
                            href={work.portfolioLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-em hover:opacity-80 transition-opacity inline-flex items-center focus:outline-none"
                            style={{
                              ...BodyStyle,
                              color: "var(--gray-300)",
                              textDecoration: "underline",
                            }}
                          >
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                    {work.description && (
                      <SectionBody className="ml-[42px] whitespace-pre-line">
                        {work.description}
                      </SectionBody>
                    )}
                  </div>
                );
              })}
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
        </div>
      </div>

      {/* Bottom Section: Carousel */}
      <div ref={carouselRef} className="flex flex-col">
        <div
          ref={containerRef}
          className="relative overflow-hidden w-full aspect-[4/3] md:aspect-auto md:h-[min(40vh,640px)]"
        >
          <div
            ref={trackRef}
            className="flex h-full items-stretch"
            style={{ gap: GAP, width: "max-content" }}
          >
            {carouselCards.map((card, idx) => {
              const work = works[idx];
              const link = getWorkLink(work);
              
              return (
                <div
                  key={card._key}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
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
