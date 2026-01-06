"use client";

import { useEffect, useRef } from "react";
import { getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

const TRAIL_ICONS = [
  "/cursor-trail/1-framer.svg",
  "/cursor-trail/2-figma.svg",
  "/cursor-trail/3-ps.svg",
  "/cursor-trail/4-typescript.svg",
  "/cursor-trail/5-css3.svg",
  "/cursor-trail/6-ae.svg",
  "/cursor-trail/7-xd.svg",
  "/cursor-trail/8-storybook.svg",
  "/cursor-trail/9-adobefirefly.svg",
  "/cursor-trail/10-adobe.svg",
  "/cursor-trail/11-git.svg",
  "/cursor-trail/12-html5.svg",
  "/cursor-trail/13-ai.svg",
  "/cursor-trail/14-analytics.svg",
  "/cursor-trail/15-js.svg",
];

export const CursorTrail = () => {
  const infoRef = useRef<{
    currentImageIndex: number;
    lastX: number;
    lastY: number;
    distanceThreshold: number;
  }>({
    currentImageIndex: 0,
    lastX: 0,
    lastY: 0,
    distanceThreshold: 30, // 간격을 2px로 줄여서 아이콘끼리 많이 겹치게 함
  });

  useEffect(() => {
    // 모바일 디바이스(터치 사용 또는 좁은 화면)에서는 실행하지 않음
    const isMobile = typeof window !== 'undefined' && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 500);
    if (prefersReducedMotion() || isMobile) return;

    // Create a container for trail elements if using portal-like behavior, 
    // or just append to body. Using a ref+absolute might be better for cleaning up.
    // However, the original code appends to "main-container". 
    // We can append to document.body to ensure it floats over everything.

    const updateThreshold = () => {
      // 화면 크기 상관없이 매우 촘촘하게 (겹치도록)
      infoRef.current.distanceThreshold = 30;
    };

    updateThreshold();
    window.addEventListener("resize", updateThreshold);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const { lastX, lastY, distanceThreshold } = infoRef.current;

      const dx = x - lastX;
      const dy = y - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > distanceThreshold) {
        createTrail(x, y);
        infoRef.current.lastX = x;
        infoRef.current.lastY = y;
      }
    };

    const createTrail = (x: number, y: number) => {
      const gsap = getGSAP();
      if (!gsap) return;

      const img = document.createElement("img");
      img.src = TRAIL_ICONS[infoRef.current.currentImageIndex];
      // 크기 16px (w-4 h-4)
      img.className = "fixed pointer-events-none z-[9990] w-8 h-8 object-contain opacity-0 select-none";
      // Note: original code used absolute, we use fixed since we append to body (or relative to viewport).

      // Center the image on cursor
      // w-12 = 3rem = 48px. Center = -24px.
      // Adjust positioning in GSAP.

      document.body.appendChild(img);

      infoRef.current.currentImageIndex = (infoRef.current.currentImageIndex + 1) % TRAIL_ICONS.length;

      // Random rotation
      const rotation = gsap.utils.random(-20, 20);

      // Initial state
      gsap.set(img, {
        x: x,
        y: y,
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        opacity: 0,
        rotation: rotation,
        filter: "grayscale(0%)", // 시작은 컬러
      });

      const tl = gsap.timeline({
        onComplete: () => {
          img.remove();
        }
      });

      // Show
      tl.to(img, {
        scale: 1,
        opacity: 1, // 완전 불투명
        duration: 0.3, // 등장 속도 극대화
        ease: "power2.out",
      })
        // Hide
        .to(img, {
          // 작아지면서 사라짐
          opacity: 0,
          filter: "grayscale(100%)", // 끝날 때는 흑백
          duration: 0.2, // 사라지는 속도 극대화 (잔상 최소화)
          ease: "power2.in",
        }, "+=0.01"); // 대기 시간 최소화
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", updateThreshold);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null; // This component doesn't render DOM itself, it manages side effects
};
