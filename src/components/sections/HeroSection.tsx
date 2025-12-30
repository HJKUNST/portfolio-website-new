"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

export type CardWithKey = PortfolioCard & { _key: string };

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
  const [containerWidth, setContainerWidth] = useState(0);

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

  // 마지막 인덱스 계산 (컨테이너 오버플로우 방지)
  // 카드가 화면에 꽉 찰 때까지만 스크롤 허용
  const visibleCardsExact = itemWidth > 0 ? containerWidth / itemWidth : 1;
  // 완전히 보이는 카드 수 (소수점 포함)로 계산하여
  // 전체 카드 수 - 보이는 카드 수 = 이동 가능한 최대 인덱스
  // e.g. 4개 카드, 화면에 2.5개 보임 -> 1.5개만큼만 이동 가능 (인덱스 1 또는 2)
  // 정수 단위 이동이므로 floor 사용하면 더 안전 (빈 공간 안 보임)
  // ceil 사용하면 마지막에 약간의 빈 공간 허용하더라도 끝까지 보여줌
  // "빈 공간이 너무 많은데" -> 빈 공간 최소화 = floor에 가깝게.
  // 그러나 단순히 floor하면 마지막 카드가 짤릴 수 있음.
  // Math.max(0, totalCards - Math.ceil(visibleCardsExact) + (visibleCardsExact % 1 > 0.1 ? 0 : 0)) logic is complex.
  // Simple heuristic: totalCards - Math.floor(containerWidth / itemWidth).
  // If container fits 3.5 cards. Total 4.
  // lastIndex = 4 - 3 = 1.
  // Index 0: 0, 1, 2, 3(half)
  // Index 1: 1, 2, 3, empty(half) -> NO.

  // If we scroll to index, left side is at index.
  // If we want last card to be right aligned:
  // Offset = TrackLength - ContainerLength.
  // But we snap to items.
  // So we limit index s.t. index * itemWidth <= TrackLength - ContainerLength.
  // index <= (totalCards * itemWidth - containerWidth) / itemWidth.
  // index <= totalCards - (containerWidth / itemWidth).

  // 마지막 인덱스 계산
  const maxScrollWidth = Math.max(0, totalCards * itemWidth - GAP - containerWidth);
  const maxIndexFloat = itemWidth > 0 ? (totalCards * itemWidth - GAP - containerWidth) / itemWidth : 0;
  // 여유있게 끝까지 갈 수 있도록 ceil 사용
  const lastIndex = Math.max(0, Math.ceil(maxIndexFloat));

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= lastIndex;

  // ============================================
  // Carousel Navigation
  // ============================================

  /** 트랙 위치를 즉시 설정 (애니메이션 없음) */
  const setPositionInstant = useCallback((index: number) => {
    if (!trackRef.current || itemWidth === 0) return;

    // Smart Centering Logic:
    // 1. 기본적으로 중앙 정렬 시도
    const cardW = itemWidth - GAP;
    const centerOffset = (containerWidth - cardW) / 2;
    let x = centerOffset - index * itemWidth;

    // 2. Constraints (우선순위 순서대로 적용)

    // A. Active Card의 왼쪽이 잘리지 않도록 보장 (Left Visibility)
    //    (카드가 컨테이너보다 클 때 왼쪽 정렬 강제)
    x = Math.max(x, -index * itemWidth);

    // B. 맨 왼쪽(Start)에 빈 공간이 생기지 않도록 제한 (gap 방지)
    //    (카드가 컨테이너보다 작을 때 왼쪽 정렬 강제 for Index 0)
    x = Math.min(x, 0);

    // C. 맨 오른쪽(End)에 빈 공간이 생기지 않도록 제한
    x = Math.max(x, -maxScrollWidth);

    const gsap = getGSAP();

    if (gsap) {
      gsap.set(trackRef.current, { x });
    } else {
      trackRef.current.style.transform = `translateX(${x}px)`;
    }
  }, [itemWidth, maxScrollWidth, containerWidth]);

  /** 트랙을 특정 인덱스로 애니메이션 */
  const animateToIndex = useCallback((index: number, onComplete?: () => void) => {
    if (!trackRef.current || itemWidth === 0) return;

    const cardW = itemWidth - GAP;
    const centerOffset = (containerWidth - cardW) / 2;
    let x = centerOffset - index * itemWidth;

    // Constraints
    x = Math.max(x, -index * itemWidth); // A. Left Visibility
    x = Math.min(x, 0); // B. Start Boundary
    x = Math.max(x, -maxScrollWidth); // C. End Boundary

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
    if (heroCards.length > 0 && cardWidth > 0) {
      setPositionInstant(0);
    }
  }, [heroCards.length, cardWidth, setPositionInstant]);

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
        className="relative overflow-hidden py-4 bg-[rgba(206,225,226,0.2)] w-full aspect-[4/3] md:aspect-auto md:h-[min(60vh,640px)]"
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
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={styles.marqueeText}>
          {text}
        </span>
      ))}
    </div>
  </div>
);

/** 캐러셀 네비게이션 버튼 */
export const CarouselNav = ({
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
export const HeroCard = ({ card }: { card: CardWithKey }) => (
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
              className="text-white font-semibold whitespace-pre-line"
              style={{
                color: 'white',
                fontSize: 'clamp(20px, 4vw, 36px)',
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
