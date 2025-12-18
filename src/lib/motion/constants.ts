export const MICRO_FAST = 0.3;
export const MICRO_SLOW = 0.7;
export const DEFAULT_EASE = "power2.out";
export const DRIFT_EASE = "sine.inOut";

export const SCROLL_START = "top 80%";
export const SCROLL_END = "top 20%";

export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

