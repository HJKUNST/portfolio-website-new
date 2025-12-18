"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollSmoother, getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

type Props = {
  children: ReactNode;
};

export const SmoothScrollProvider = ({ children }: Props) => {
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useEffect(() => {
    const gsap = getGSAP();
    if (!gsap || prefersReducedMotion()) return;

    smootherRef.current?.kill();
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
    });

    return () => smootherRef.current?.kill();
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
};

