"use client";

import type { DOMTarget } from "gsap";
import { ScrollTrigger } from "./gsap";
import { SCROLL_END, SCROLL_START } from "./constants";

export type ScrollRangeOptions = {
  start?: string;
  end?: string;
  scrub?: boolean | number;
};

export const defaultScrollRange: ScrollRangeOptions = {
  start: SCROLL_START,
  end: SCROLL_END,
  scrub: true,
};

export const createScrollTrigger = (trigger: DOMTarget, options: ScrollTrigger.Vars) => {
  return ScrollTrigger.create({
    start: SCROLL_START,
    end: SCROLL_END,
    ...options,
    trigger,
  });
};

