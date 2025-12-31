import { useState, useRef, useEffect, useCallback } from "react";
import { getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

interface UseTimelineProps {
  totalItems: number;
  currentIndex: number;
  isMobile: boolean;
  onItemClick: (index: number) => void;
}

export const useTimeline = ({ totalItems, currentIndex, isMobile, onItemClick }: UseTimelineProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 스크롤하여 항목이 보이도록 하는 함수 (Desktop only)
  const scrollIntoViewIfNeeded = useCallback((element: HTMLDivElement | null) => {
    if (isMobile || !element || !listContainerRef.current) return;

    const container = listContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // 항목이 컨테이너의 가시 영역 안에 완전히 들어있는지 확인
    const isFullyVisible = 
      elementRect.top >= containerRect.top &&
      elementRect.bottom <= containerRect.bottom;

    // 완전히 보이면 스크롤하지 않음
    if (isFullyVisible) return;

    const gsap = getGSAP();
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
  }, [isMobile]);

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

  // Auto-scroll list when hoveredIndex changes (Desktop only) - 카드 hover 시 타임라인 스크롤
  useEffect(() => {
    if (isMobile) return;
    if (hoveredIndex === null) return;

    const list = listContainerRef.current;
    if (!list) return;

    const hoveredItem = itemRefs.current[hoveredIndex];
    if (!hoveredItem) return;

    scrollIntoViewIfNeeded(hoveredItem);
  }, [hoveredIndex, isMobile, scrollIntoViewIfNeeded]);

  // 초기 마운트 시 첫 번째 항목으로 스크롤 (Desktop only)
  useEffect(() => {
    if (isMobile) return;
    
    const list = listContainerRef.current;
    if (!list) return;

    const firstItem = itemRefs.current[0];
    if (!firstItem) return;

    const listHeight = list.clientHeight;
    const itemTop = firstItem.offsetTop;
    const itemHeight = firstItem.offsetHeight;
    const targetScroll = itemTop - listHeight / 2 + itemHeight / 2;

    const timeoutId = setTimeout(() => {
      list.scrollTo({ top: targetScroll, behavior: "auto" });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isMobile]);

  const handleItemClick = useCallback((idx: number) => {
    if (!isMobile) {
      onItemClick(idx);
      scrollIntoViewIfNeeded(itemRefs.current[idx]);
    }
  }, [isMobile, onItemClick, scrollIntoViewIfNeeded]);

  const handleItemMouseEnter = useCallback((idx: number) => {
    if (!isMobile) {
      setHoveredIndex(idx);
      scrollIntoViewIfNeeded(itemRefs.current[idx]);
    }
  }, [isMobile, scrollIntoViewIfNeeded]);

  const handleItemMouseLeave = useCallback(() => {
    if (!isMobile) {
      setHoveredIndex(null);
    }
  }, [isMobile]);

  const handleItemFocus = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!isMobile) {
      scrollIntoViewIfNeeded(e.currentTarget);
    }
  }, [isMobile, scrollIntoViewIfNeeded]);

  const getIsActive = useCallback((idx: number) => {
    return !isMobile && (hoveredIndex !== null ? idx === hoveredIndex : idx === currentIndex);
  }, [isMobile, hoveredIndex, currentIndex]);

  return {
    hoveredIndex,
    setHoveredIndex,
    listContainerRef,
    itemRefs,
    handleItemClick,
    handleItemMouseEnter,
    handleItemMouseLeave,
    handleItemFocus,
    getIsActive,
  };
};

