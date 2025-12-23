"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

let registered = false;

export const getGSAP = () => {
  if (typeof window === "undefined") return null;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrambleTextPlugin);
    registered = true;
  }
  return gsap;
};

export { ScrollTrigger, ScrollSmoother };

