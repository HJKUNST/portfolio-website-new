import { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";
import { CAROUSEL_GAP, ANIMATION_DURATION, WHEEL_COOLDOWN_MS } from "@/lib/works/constants";

interface UseCarouselProps {
  totalCards: number;
  isMobile: boolean;
}

export const useCarousel = ({ totalCards, isMobile }: UseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isInitializedRef = useRef(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const lastWheelTimeRef = useRef(0);

  const itemWidth = cardWidth + CAROUSEL_GAP;
  const trackTotalWidth = totalCards * itemWidth;
  const maxScrollWidth = Math.max(0, trackTotalWidth - containerWidth);
  const maxIndexFloat = itemWidth > 0 ? maxScrollWidth / itemWidth : 0;
  const lastIndex = Math.max(0, Math.ceil(maxIndexFloat));

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= lastIndex;

  const setPositionInstant = useCallback(
    (index: number) => {
      if (!trackRef.current || itemWidth === 0) return;

      const cardW = itemWidth - CAROUSEL_GAP;
      const centerOffset = (containerWidth - cardW) / 2;
      let x = centerOffset - index * itemWidth;

      x = Math.max(x, -index * itemWidth);
      x = Math.min(x, 0);
      x = Math.max(x, -maxScrollWidth);

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

      const cardW = itemWidth - CAROUSEL_GAP;
      const centerOffset = (containerWidth - cardW) / 2;
      let x = centerOffset - index * itemWidth;

      x = Math.max(x, -index * itemWidth);
      x = Math.min(x, 0);
      x = Math.max(x, -maxScrollWidth);

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

  // 초기 위치 설정
  useLayoutEffect(() => {
    if (totalCards > 0 && cardWidth > 0 && !isInitializedRef.current) {
      isInitializedRef.current = true;
      setCurrentIndex(0);
      setPositionInstant(0);
    }
  }, [totalCards, cardWidth, setPositionInstant]);

  // 리사이즈 시 현재 위치 유지
  useEffect(() => {
    if (cardWidth > 0) {
      setPositionInstant(currentIndex);
    }
  }, [cardWidth, currentIndex, setPositionInstant]);

  // 휠 스크롤로 캐러셀 탐색 (Desktop only)
  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();

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

  return {
    currentIndex,
    setCurrentIndex,
    cardWidth,
    containerWidth,
    isDesktop,
    containerRef,
    trackRef,
    goToIndex,
    goNext,
    goPrev,
    isAtStart,
    isAtEnd,
  };
};

