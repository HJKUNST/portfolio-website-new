"use client";

import { useEffect, useRef, useState } from "react";
import { getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

type CustomCursorProps = {
  /** 커서가 확대될 요소들의 선택자 (예: ".card", "[data-cursor-hover]") */
  hoverSelectors?: string[];
  /** hover 시 커서 크기 배율 (기본값: 2) */
  hoverScale?: number;
  /** hover 시 표시할 아이콘 (이미지 경로 또는 ReactNode) */
  hoverIcon?: string | React.ReactNode;
  /** 선택자별 아이콘 매핑 (선택자가 매칭되면 해당 아이콘 사용) */
  selectorIcons?: Map<string, string | React.ReactNode>;
};

export const CustomCursor = ({
  hoverSelectors = [],
  hoverScale = 2,
  hoverIcon,
  selectorIcons,
}: CustomCursorProps) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cursorColor, setCursorColor] = useState("rgba(141, 195, 198, 1)");

  // 색상 보간 함수
  const interpolateColor = (t: number) => {
    // t는 0-1 사이의 값 (0 = 파란색, 1 = 빨간색)
    const blue = { r: 141, g: 195, b: 198 };
    const red = { r: 253, g: 154, b: 109 };

    const r = Math.round(blue.r + (red.r - blue.r) * t);
    const g = Math.round(blue.g + (red.g - blue.g) * t);
    const b = Math.round(blue.b + (red.b - blue.b) * t);

    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!cursorRef.current) return;

    const gsap = getGSAP();
    if (!gsap) return;

    const cursor = cursorRef.current;

    // 초기 위치 설정 (중앙 정렬)
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    // quickTo를 사용한 부드러운 움직임
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.6, ease: "power3" });

    // 움직임 추적을 위한 변수
    let lastX = 0;
    let lastY = 0;
    let lastScrollY = window.scrollY;
    let isFirstMove = true;
    let isMoving = false;
    let movementTimeout: NodeJS.Timeout | null = null;
    const MOVEMENT_THRESHOLD = 1; // 픽셀 단위 - 이 이상 움직이면 움직임으로 간주
    const STOP_DELAY = 200; // 밀리초 - 이 시간 동안 움직임이 없으면 멈춤으로 간주

    // 색상 애니메이션을 위한 객체 (0 = 파란색, 1 = 빨간색)
    const colorObj = { t: 0 };
    let colorTween: gsap.core.Tween | null = null;

    // 색상 업데이트 함수
    const updateColor = (shouldBeRed: boolean) => {
      const targetT = shouldBeRed ? 1 : 0;

      // 이미 목표 색상이면 업데이트하지 않음
      if (colorObj.t === targetT && isMoving === shouldBeRed) return;

      isMoving = shouldBeRed;

      // 부드러운 애니메이션으로 색상 업데이트
      if (colorTween) {
        colorTween.kill();
      }
      colorTween = gsap.to(colorObj, {
        t: targetT,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          const color = interpolateColor(colorObj.t);
          setCursorColor(color);
        },
      });
    };

    // 스크롤 움직임 추적
    const handleScroll = () => {
      const scrollDelta = Math.abs(window.scrollY - lastScrollY);

      // 스크롤 움직임이 있으면 빨간색으로
      if (scrollDelta > MOVEMENT_THRESHOLD) {
        updateColor(true);

        // 스크롤 멈춤 감지
        if (movementTimeout) clearTimeout(movementTimeout);
        movementTimeout = setTimeout(() => {
          updateColor(false);
        }, STOP_DELAY);
      }

      lastScrollY = window.scrollY;
    };

    // 마우스 움직임 추적
    const handleMouseMove = (e: MouseEvent) => {
      if (isFirstMove) {
        lastX = e.clientX;
        lastY = e.clientY;
        isFirstMove = false;
        xTo(e.clientX);
        yTo(e.clientY);
        return;
      }

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 마우스 움직임이 있으면 빨간색으로
      if (distance > MOVEMENT_THRESHOLD) {
        updateColor(true);

        // 마우스 멈춤 감지
        if (movementTimeout) clearTimeout(movementTimeout);
        movementTimeout = setTimeout(() => {
          updateColor(false);
        }, STOP_DELAY);
      }

      lastX = e.clientX;
      lastY = e.clientY;

      xTo(e.clientX);
      yTo(e.clientY);
    };

    // hover 상태 관리
    let isHovering = false;

    const handleMouseEnter = () => {
      if (isHovering) return;
      isHovering = true;

      gsap.to(cursor, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      if (!isHovering) return;
      isHovering = false;

      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // hover 대상 요소들에 이벤트 리스너 추가
    const hoverElements: Element[] = [];
    hoverSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        hoverElements.push(el);
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    });

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      if (movementTimeout) clearTimeout(movementTimeout);
      if (colorTween) colorTween.kill();
    };
  }, [hoverSelectors, hoverScale]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ willChange: "transform" }}
    >
      <div className="relative w-[12px] h-[12px]">
        <svg
          width="12"
          height="12"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <circle cx="5" cy="5" r="5" fill={cursorColor} />
        </svg>
      </div>
    </div>
  );
};

