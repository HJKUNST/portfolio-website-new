"use client";

import { useEffect, useLayoutEffect, useRef, forwardRef, useState, useMemo, useCallback } from "react";
import { getGSAP } from "@/lib/motion/gsap";
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
const SectionSubtitle = ({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <h3 className={`text-h3-em mb-3 ${className}`} style={{ ...subtitleStyle, ...style }}>
    {children}
  </h3>
);

const SectionBody = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
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
};

const works: WorkItem[] = [
  {
    id: "eisen-trading",
    year: "2025",
    title: "EISEN – On-Chain + CEX Trading Interface Made Clear",
    description: "Works of Eisen : Graphics, Data, Performance\n3rd Place on Hyperliquid Hackathon : HODL BOT Pitch Deck\nKorea Stablecoin Hackathon : TGIF - KRW Stablecoin based FX Hedge",
    image: "/eisen-trading-interface.png",
    tags: ["UI/UX", "Design Engineering"],
    subtitle: "Onchain + CEX Trading Interface Made Clear"
  },
  {
    id: "works-of-eisen-1",
    year: "2025",
    title: "Works of Eisen : Graphics, Data, Performance",
    image: "/works-of-eisen-1.png",
    tags: ["Graphic Design", "Brand Experience"],
    subtitle: "Works of Eisen"
  },
  {
    id: "works-of-eisen-2",
    year: "2025",
    title: "Works of Eisen : Graphics, Data, Performance",
    image: "/works-of-eisen-2.png",
    tags: ["Graphic Design", "Data Visualization"],
    subtitle: "Works of Eisen"
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

  // Carousel Refs & State
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

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

  const totalCards = carouselCards.length;
  const itemWidth = cardWidth + GAP;

  // Calculate Navigation Bounds
  // Track의 전체 너비: totalCards * itemWidth (각 카드 + gap 포함)
  // 마지막 카드가 완전히 보이려면 track의 오른쪽 끝이 container의 오른쪽 끝에 맞춰져야 함
  // 따라서 maxScrollWidth = trackTotalWidth - containerWidth
  // GAP을 빼지 않는 이유: 마지막 카드 뒤의 gap도 track의 일부이므로 포함해야 함
  const trackTotalWidth = totalCards * itemWidth;
  const maxScrollWidth = Math.max(0, trackTotalWidth - containerWidth);
  const maxIndexFloat = itemWidth > 0 ? maxScrollWidth / itemWidth : 0;
  const lastIndex = Math.max(0, Math.ceil(maxIndexFloat));

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= lastIndex;

  // --- Carousel Logic (Adapted from HeroSection) ---

  const setPositionInstant = useCallback((index: number) => {
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
  }, [itemWidth, maxScrollWidth, containerWidth]);

  const animateToIndex = useCallback((index: number, onComplete?: () => void) => {
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
  }, [itemWidth, setPositionInstant, maxScrollWidth, containerWidth]);

  const goToIndex = useCallback((newIndex: number) => {
    if (isTransitioningRef.current || totalCards === 0) return;

    const clampedIndex = Math.max(0, Math.min(newIndex, lastIndex));
    // Note: We allow triggering even if same index to ensure alignment if needed, 
    // but usually we can skip. Let's align with HeroSection logic.
    if (clampedIndex === currentIndex) return;

    isTransitioningRef.current = true;

    animateToIndex(clampedIndex, () => {
      setCurrentIndex(clampedIndex);
      isTransitioningRef.current = false;
    });
  }, [totalCards, lastIndex, currentIndex, animateToIndex]);

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


  /** 휠 스크롤로 캐러셀 탐색 */
  useEffect(() => {
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
  }, [goNext, goPrev]);


  return (
    <section
      className="section-shell max-w-[1280px] mx-auto pb-24 px-5 md:px-10 flex flex-col gap-16"
      style={{ background: "#FCFCFC", paddingTop: "160px" }}
    >
      {/* Top Section: Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Left: Title & Description */}
        <div>
          <h1 className="text-h1-gradient mb-4" style={TitleStyle}>
            Selected Works
          </h1>
          <p
            className="text-em"
            style={{
              ...BodyStyle,
              maxWidth: "505px",
            }}
          >
            I design clarity for complex financial products—across interfaces, data, and performance. Excited about what we can build together.
          </p>
        </div>

        {/* Right: Work List with Highlighting */}
        <div className="space-y-8">
          {works.map((work, idx) => {
            // Highlight 우선순위: hover 중일 때는 hover된 카드만, 아니면 가운데 카드
            const isActive = hoveredIndex !== null 
              ? idx === hoveredIndex 
              : idx === currentIndex;
            return (
              <div
                key={work.id}
                className={clsx("transition-opacity duration-300 cursor-pointer", isActive ? "opacity-100" : "opacity-40")}
                onClick={() => goToIndex(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex gap-3 mb-2">
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
                  <SectionSubtitle className="!mb-0 !bg-none !text-[var(--gray-900)] !font-medium">
                    {work.title}
                  </SectionSubtitle>
                </div>
                {work.description && (
                  <SectionBody className="ml-[49px] whitespace-pre-line opacity-80">
                    {work.description}
                  </SectionBody>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Carousel */}
      <div>
        <div
          ref={containerRef}
          className="relative overflow-hidden py-4 w-full aspect-[4/3] md:aspect-auto md:h-[min(60vh,640px)]"
        // Removed bg color to match design request if needed, or keep it consistent? 
        // User request didn't specify BG, but usually carousel areas might have subtle bg. 
        // Previous RightColumn had white images. HeroSection has rgba(206,225,226,0.2).
        // Let's keep it clean or use the Hero style if implied "call hero card carousel".
        // I will use transparent for now to fit the section bg #FCFCFC.
        >
          <div
            ref={trackRef}
            className="flex h-full items-stretch"
            style={{ gap: GAP, width: "max-content" }}
          >
            {carouselCards.map((card, idx) => (
              <div
                key={card._key}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <HeroCard card={card} />
              </div>
            ))}
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
