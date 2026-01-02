import { useEffect, RefObject } from "react";
import { getGSAP, ScrollTrigger } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

interface UsePageAnimationsProps {
  sectionRef: RefObject<HTMLElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  descriptionRef: RefObject<HTMLParagraphElement | null>;
  timelineSubtitleRef: RefObject<HTMLHeadingElement | null>;
  carouselRef: RefObject<HTMLDivElement | null>;
  itemRefs: RefObject<(HTMLDivElement | null)[]>;
}

export const usePageAnimations = ({
  sectionRef,
  titleRef,
  descriptionRef,
  timelineSubtitleRef,
  carouselRef,
  itemRefs,
}: UsePageAnimationsProps) => {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current) return;

    const gsap = getGSAP();
    if (!gsap || !ScrollTrigger) return;

    const mm = gsap.matchMedia();

    // Title animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Description animation
    if (descriptionRef.current) {
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Timeline subtitle animation
    if (timelineSubtitleRef.current) {
      gsap.set(timelineSubtitleRef.current, { opacity: 1 });
      gsap.fromTo(
        timelineSubtitleRef.current,
        { opacity: 1 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineSubtitleRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }

    // Work list items animation (Desktop only)
    mm.add("(min-width: 768px)", () => {
      itemRefs.current.forEach((ref, idx) => {
        if (!ref) return;
        // 첫 번째 항목(idx === 0)은 currentIndex가 0이므로 ScrollTrigger를 적용하지 않음
        if (idx === 0) {
          gsap.set(ref, { opacity: 1 });
          return;
        }
        gsap.fromTo(
          ref,
          { opacity: 1 },
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref,
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    });

    // Carousel section animation
    if (carouselRef.current) {
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger && itemRefs.current.includes(trigger.vars.trigger as HTMLDivElement)) {
          trigger.kill();
        }
      });
    };
  }, [sectionRef, titleRef, descriptionRef, timelineSubtitleRef, carouselRef, itemRefs]);
};

