"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ScrollTrigger, getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

type Props = {
  steps?: string[];
};

// ============================================
// Default Data (기본 데이터)
// ============================================

const DEFAULT_STEPS = [
  "I design with the mindset of shared craftery,",
  "aiming for interfaces that hold together, convert cleanly,",
  "and age well because the work underneath is honest.",
];

export const SharedCrafteryPathSection = ({ steps = DEFAULT_STEPS }: Props) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const isManualScrollRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const gsap = getGSAP();
    if (!gsap || !ScrollTrigger || prefersReducedMotion()) return;
    if (!pathRef.current || !containerRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    // 초기 설정: 경로를 보이지 않게
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    // 스크롤에 따라 경로가 점진적으로 그려지는 애니메이션
    const tween = gsap.to(path, {
      strokeDashoffset: 0,  // 목표: 경로가 완전히 보이게
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 10%",       // 섹션 상단이 뷰포트 20% 지점에 닿을 때 시작 (더 일찍)
        end: "+=100%",          // 스크롤 100vh 동안 애니메이션 진행
        pin: true,              // 섹션을 고정
        pinSpacing: true,       // 고정 후 공간 확보
        scrub: 1,               // 스크롤과 부드럽게 동기화 (1초 딜레이)
        onUpdate: (self) => {
          // 수동 스크롤 중이면 업데이트하지 않음
          if (isManualScrollRef.current) return;

          // 카드 활성화 상태 업데이트
          const progress = self.progress;
          if (progress < 0.33) setActiveIndex(0);
          else if (progress < 0.67) setActiveIndex(1);
          else setActiveIndex(2);
        },
      },
    });

    scrollTriggerRef.current = tween.scrollTrigger || null;

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // 카드 클릭 핸들러 - 해당 카드로 스크롤 이동
  const handleCardClick = (index: number) => {
    const card = cardRefs.current[index];
    if (!card || !containerRef.current) return;

    // activeIndex 먼저 업데이트
    setActiveIndex(index);
    isManualScrollRef.current = true;

    const gsap = getGSAP();
    const scrollTrigger = scrollTriggerRef.current;

    if (!gsap || !scrollTrigger || prefersReducedMotion()) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        isManualScrollRef.current = false;
      }, 1000);
      return;
    }

    // ScrollTrigger의 progress를 직접 조작
    // 각 카드는 전체 progress의 0, 0.33, 0.67, 1.0에 해당
    const targetProgress = index / (steps.length - 1);

    // ScrollTrigger의 start와 end를 숫자로 변환
    // start는 "top 10%" 형식이므로 실제 스크롤 위치를 계산해야 함
    const trigger = scrollTrigger.trigger as HTMLElement;
    const triggerStart = scrollTrigger.start as number;
    const triggerEnd = scrollTrigger.end as number;

    // 목표 스크롤 위치 계산
    const scrollRange = triggerEnd - triggerStart;
    const targetScroll = triggerStart + (scrollRange * targetProgress);

    // 부드럽게 스크롤
    const startY = window.scrollY;
    const distance = targetScroll - startY;
    const duration = 0.8;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // ease: power2.inOut
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // 애니메이션 완료 후 플래그 해제
        setTimeout(() => {
          isManualScrollRef.current = false;
        }, 200);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <section
      ref={containerRef}
      className="relative section-shell overflow-visible flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(to bottom, rgba(136,195,198,0) 0%, rgba(136,195,198,1) 40%, rgba(136,195,198,1) 60%, rgba(136,195,198,0) 100%)"
      }}>
      <p
        className="text-h3-em mb-[48px] self-start"
        style={{
          background: "none",
          WebkitBackgroundClip: "unset",
          backgroundClip: "unset",
          color: "white",
        }}
      >{`//  Vision that I take my work towards`}</p>
      <div className="absolute inset-0 opacity-75 flex items-center justify-center" style={{ zIndex: 0 }}>
        <svg
          viewBox="0 0 910 793"
          fill="none"
          className="w-auto h-auto min-w-[900px]"
          style={{ transform: "scale(1.1)", transformOrigin: "center center" }}
        >
          <defs>
            <linearGradient
              id="pathStrokeGradient"
              gradientUnits="userSpaceOnUse"
              x1="665.5"
              y1="25"
              x2="464.001"
              y2="798"
            >
              <stop offset="0%" stopColor="rgba(231,243,244,0)" />
              <stop offset="50%" stopColor="rgba(231,243,244,1)" />
              <stop offset="100%" stopColor="rgba(231,243,244,0)" />
            </linearGradient>
          </defs>
          <path
            ref={pathRef}
            d="M665.5 25C609.501 25 385 139.5 385 219C385 336.708 782.501 199.227 782.501 357.5C782.501 515.773 25 551.5 25 477.414C25 376 899 460.604 899 655.5C899 798 590.002 798 464.001 798"
            fill="none"
            stroke="url(#pathStrokeGradient)"
            strokeWidth={60}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative grid md:grid-cols-3" style={{ zIndex: 1 }}>
        {steps.map((line, idx) => (
          <div
            key={line}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className={clsx("card-shell", idx === activeIndex && "active")}
            data-cursor-focus
            onClick={() => handleCardClick(idx)}
            style={{ cursor: "pointer" }}
          >
            <p
              className="text-h2 text-left leading-snug flex-1"
              style={{
                color: 'white',
              }}
            >{line}</p>
            <svg className="self-end mt-auto" width="78" height="79" viewBox="0 0 78 79" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="75.9434" y1="39.3552" x2="5.79323e-05" y2="39.3552" stroke="white" stroke-width="2" />
              <line x1="75.2363" y1="39.0623" x2="36.881" y2="0.707122" stroke="white" stroke-width="2" />
              <line x1="76.6505" y1="39.0623" x2="38.2953" y2="77.4175" stroke="white" stroke-width="2" />
            </svg>

          </div>
        ))}
      </div>
    </section>
  );
};
