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
  /** mix-blend-difference 적용 여부 (기본값: true) */
  useBlendDifference?: boolean;
};

export const CustomCursor = ({
  hoverSelectors = [],
  hoverScale = 4,
  hoverIcon,
  selectorIcons,
  useBlendDifference = true,
}: CustomCursorProps) => {
  // 더 큰 캔버스에 그리고 축소해두면 확대 시에도 깨짐이 줄어듭니다.
  const BASE_CURSOR_SIZE = 128;
  const DISPLAY_CURSOR_SIZE = 12;
  const SCALE_DOWN = DISPLAY_CURSOR_SIZE / BASE_CURSOR_SIZE;
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cursorColor, setCursorColor] = useState("rgba(141, 195, 198, 1)");

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

    // 색상 정의
    const BLUE = { r: 141, g: 195, b: 198 };
    const RED = { r: 253, g: 154, b: 109 };
    const GRAY = { r: 220, g: 220, b: 220 };

    // 현재 색상 상태 (RGB)
    const currentColorObj = { ...BLUE };
    let colorTween: gsap.core.Tween | null = null;

    // 상태 플래그
    let isHovering = false;
    let isMoving = false;

    // 색상 업데이트 함수
    const updateCursorColor = () => {
      let target = BLUE;
      // Hover가 최우선
      if (isHovering) {
        target = GRAY;
      }
      // 그 다음이 움직임
      else if (isMoving) {
        target = RED;
      }
      // 아무것도 아니면 BLUE (기본)

      if (colorTween) colorTween.kill();

      colorTween = gsap.to(currentColorObj, {
        r: target.r,
        g: target.g,
        b: target.b,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          setCursorColor(`rgba(${Math.round(currentColorObj.r)}, ${Math.round(currentColorObj.g)}, ${Math.round(currentColorObj.b)}, 1)`);
        },
      });
    };

    const setMoving = (moving: boolean) => {
      // 상태가 바뀌었을 때만 업데이트
      if (isMoving !== moving) {
        isMoving = moving;
        updateCursorColor();
      }
    };

    // 움직임 추적 변수
    let lastX = 0;
    let lastY = 0;
    let lastScrollY = window.scrollY;
    let isFirstMove = true;
    let movementTimeout: NodeJS.Timeout | null = null;
    const MOVEMENT_THRESHOLD = 1;
    const STOP_DELAY = 200;

    const handleScroll = () => {
      const scrollDelta = Math.abs(window.scrollY - lastScrollY);
      if (scrollDelta > MOVEMENT_THRESHOLD) {
        setMoving(true);
        if (movementTimeout) clearTimeout(movementTimeout);
        movementTimeout = setTimeout(() => {
          setMoving(false);
        }, STOP_DELAY);
      }
      lastScrollY = window.scrollY;
    };

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

      if (distance > MOVEMENT_THRESHOLD) {
        setMoving(true);
        if (movementTimeout) clearTimeout(movementTimeout);
        movementTimeout = setTimeout(() => {
          setMoving(false);
        }, STOP_DELAY);
      }

      lastX = e.clientX;
      lastY = e.clientY;
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseEnter = () => {
      if (isHovering) return;
      isHovering = true;
      updateCursorColor();

      gsap.to(cursor, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      if (!isHovering) return;
      isHovering = false;
      updateCursorColor();

      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

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
      className={`fixed top-0 left-0 pointer-events-none z-[9999] max-[700px]:hidden ${useBlendDifference ? "mix-blend-difference" : ""}`}
      style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
    >
      <div
        className="relative"
        style={{
          width: BASE_CURSOR_SIZE,
          height: BASE_CURSOR_SIZE,
          transform: `scale(${SCALE_DOWN}) translateZ(0)`,
          transformOrigin: "center",
        }}
      >
        <svg
          width={BASE_CURSOR_SIZE}
          height={BASE_CURSOR_SIZE}
          viewBox={`0 0 ${BASE_CURSOR_SIZE} ${BASE_CURSOR_SIZE}`}
          shapeRendering="geometricPrecision"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <circle
            cx={BASE_CURSOR_SIZE / 2}
            cy={BASE_CURSOR_SIZE / 2}
            r={BASE_CURSOR_SIZE / 2}
            fill={cursorColor}
          />
        </svg>
      </div>
    </div>
  );
};
