"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { PortfolioCard } from "@/lib/figma/types";
import { getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";
import styles from "./HeroSection.module.css";

// ============================================
// Constants
// ============================================

const GAP = 2;
const WHEEL_COOLDOWN_MS = 500;
const ANIMATION_DURATION = 0.5;

// ============================================
// Default Data (기본 데이터)
// ============================================

const DEFAULT_HEADLINE = "I Bake Interface until They're Ready to Serve";

const DEFAULT_TAGS = [
  "Product Design",
  "UX/UI Design",
  "Intuitive User Experiences",
  "Blockchain UX",
  "Prototyping",
  "Design Systems",
  "User Research",
  "Product Strategy",
  "Data Visualization",
  "Google Analytics",
];

const DEFAULT_CARDS: PortfolioCard[] = [
  { title: "EISEN Finance", subtitle: "Onchain + CEX Trading Interface Made Clear", tags: ["UI/UX", "Design Engineering"], image: "/eisen app.png" },
  { title: "Graphics, Data, Performance", subtitle: "Works of Eisen", tags: ["Graphic Design", "Brand Experience", "Performance Marketing", "Data Visualization"], image: "/eisen graphic.png" },
  { title: "Korea Stablecoin Hackathon Winner: \n TGIF - Hedging the FX Market", subtitle: "KRW native stables to hedge FX risk", tags: ["UI", "Brand Experience", "Pitch Deck"], image: "/tgif.png" },
  { title: "Hyperliquid Hackathon Winner: \n HODL Bot - Unified Trading Assistant", subtitle: "Telegram based delta-neutral trading bot", tags: ["User Experience", "Brand Experience", "Pitch Deck"], image: "/hodl.png" },
];

// ============================================
// Types
// ============================================

type Props = {
  headline?: string;
  tags?: string[];
  cards?: PortfolioCard[];
};

type CardWithKey = PortfolioCard & { _key: string };

// ============================================
// Main Component
// ============================================

export const HeroSection = ({
  headline = DEFAULT_HEADLINE,
  tags = DEFAULT_TAGS,
  cards = DEFAULT_CARDS
}: Props) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const lastWheelTimeRef = useRef(0);

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  // Derived values
  const marqueeText = useMemo(() => tags.join(" · "), [tags]);
  const itemWidth = cardWidth + GAP;

  // 카드 데이터 준비
  const heroCards = useMemo<CardWithKey[]>(() => {
    return cards.map((card, idx) => ({
      ...card,
      // image가 없으면 undefined로 설정 (빈 div 렌더링)
      image: card.image || undefined,
      _key: `hero-card-${idx}`,
    }));
  }, [cards]);

  const totalCards = heroCards.length;
  const lastIndex = Math.max(totalCards - 1, 0);
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === lastIndex;

  // ============================================
  // Carousel Navigation
  // ============================================

  /** 트랙 위치를 즉시 설정 (애니메이션 없음) */
  const setPositionInstant = useCallback((index: number) => {
    if (!trackRef.current || itemWidth === 0) return;

    const x = -index * itemWidth;
    const gsap = getGSAP();

    if (gsap) {
      gsap.set(trackRef.current, { x });
    } else {
      trackRef.current.style.transform = `translateX(${x}px)`;
    }
  }, [itemWidth]);

  /** 트랙을 특정 인덱스로 애니메이션 */
  const animateToIndex = useCallback((index: number, onComplete?: () => void) => {
    if (!trackRef.current || itemWidth === 0) return;

    const x = -index * itemWidth;
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
  }, [itemWidth, setPositionInstant]);

  /** 특정 인덱스로 이동 (범위 제한 적용) */
  const goToIndex = useCallback((newIndex: number) => {
    if (isTransitioningRef.current || totalCards === 0) return;

    const clampedIndex = Math.max(0, Math.min(newIndex, lastIndex));
    if (clampedIndex === currentIndex) return;

    isTransitioningRef.current = true;

    animateToIndex(clampedIndex, () => {
      setCurrentIndex(clampedIndex);
      isTransitioningRef.current = false;
    });
  }, [totalCards, lastIndex, currentIndex, animateToIndex]);

  const goNext = useCallback(() => goToIndex(currentIndex + 1), [goToIndex, currentIndex]);
  const goPrev = useCallback(() => goToIndex(currentIndex - 1), [goToIndex, currentIndex]);

  // ============================================
  // Effects
  // ============================================

  /** 컨테이너 높이 기반으로 카드 너비 계산 (4:3 비율 유지) */
  useEffect(() => {
    const updateCardWidth = () => {
      if (!containerRef.current) return;
      const height = containerRef.current.offsetHeight;
      setCardWidth(Math.round(height * (4 / 3)));
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  /** 초기 위치 설정 */
  useEffect(() => {
    setCurrentIndex(0);
    setPositionInstant(0);
  }, [heroCards, setPositionInstant]);

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

  // ============================================
  // Render
  // ============================================

  return (
    <section className="section-shell flex flex-col justify-center">
      {/* Header */}
      <div className="flex flex-col mt-10">
        <p className="text-h3-em">{headline}</p>
        <TagsMarquee text={marqueeText} />
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="relative overflow-hidden py-4 bg-[rgba(206,225,226,0.2)]"
        style={{ height: "min(60vh, 640px)" }}
      >
        <div
          ref={trackRef}
          className="flex h-full items-stretch"
          style={{ gap: GAP, width: "max-content" }}
        >
          {heroCards.map((card) => (
            <HeroCard key={card._key} card={card} />
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
    </section>
  );
};

// ============================================
// Sub Components
// ============================================

/** 태그 마르키 애니메이션 */
const TagsMarquee = ({ text }: { text: string }) => (
  <div className={clsx(styles.marqueeWrapper, "text-body text-gray-500")} aria-label={text}>
    <div className={styles.marqueeContent}>
      {[0, 1].map((i) => (
        <span key={i} className={styles.marqueeText}>
          {text}
        </span>
      ))}
    </div>
  </div>
);

/** 캐러셀 네비게이션 버튼 */
const CarouselNav = ({
  onPrev,
  onNext,
  isAtStart,
  isAtEnd,
}: {
  onPrev: () => void;
  onNext: () => void;
  isAtStart: boolean;
  isAtEnd: boolean;
}) => {
  const buttonBase = "flex items-center gap-2 px-4 py-2 rounded-2xl transition";
  const buttonActive = "bg-gray-100 hover:bg-gray-200";
  const buttonDisabled = "bg-gray-50 text-gray-300 cursor-not-allowed";

  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        className={clsx(buttonBase, isAtStart ? buttonDisabled : buttonActive)}
        onClick={onPrev}
        disabled={isAtStart}
        aria-label="Previous"
      >
        <ChevronLeftIcon aria-hidden />
      </button>
      <button
        className={clsx(buttonBase, isAtEnd ? buttonDisabled : buttonActive)}
        onClick={onNext}
        disabled={isAtEnd}
        aria-label="Next"
      >
        <ChevronRightIcon aria-hidden />
      </button>
    </div>
  );
};

/** 히어로 카드 */
const HeroCard = ({ card }: { card: CardWithKey }) => (
  <div
    className="group relative flex-none overflow-hidden rounded-2xl h-full cursor-pointer hero-card"
    data-cursor-hover
    style={{ aspectRatio: "4 / 3" }}
  >
    {card.image ? (
      <>
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover transition-all duration-300"
          priority
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
        {/* Hover overlay with blur and info */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 ">
          {/* Tags - 우상단 */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {card.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-2xl text-body overflow-hidden"
                  style={{
                    color: "white",
                    boxShadow: "inset 0 4px 20px 0 rgba(210,210,210,0.25)",
                    borderRadius: "1rem"
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {/* Title & Subtitle - 하단 */}
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3
              className="text-white text-h2 font-semibold whitespace-pre-line"
              style={{
                color: 'white',

              }}
            >{card.title}</h3>
            {card.subtitle && (
              <p className={styles.marqueeText} style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                {card.subtitle}
              </p>
            )}
          </div>
        </div>
      </>
    ) : (
      <div className="absolute inset-0 hero-card-empty" />
    )}
    {/* Inset shadow overlay - 이미지 위에 항상 표시 */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ boxShadow: "inset 0 0 50px 0 #85adaf" }}
    />
  </div>
);
