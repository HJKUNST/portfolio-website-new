"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ScrollTrigger, getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

type Props = {
  steps: string[];
};

export const SharedCrafteryPathSection = ({ steps }: Props) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
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
        start: "top top",       // 섹션 상단이 뷰포트 상단에 닿을 때 시작
        end: "+=100%",          // 스크롤 100vh 동안 애니메이션 진행
        pin: true,              // 섹션을 고정
        pinSpacing: true,       // 고정 후 공간 확보
        scrub: 1,               // 스크롤과 부드럽게 동기화 (1초 딜레이)
        onUpdate: (self) => {
          // 카드 활성화 상태 업데이트
          const progress = self.progress;
          if (progress < 0.3) setActiveIndex(0);
          else if (progress < 0.6) setActiveIndex(1);
          else setActiveIndex(2);
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative section-shell overflow-visible flex items-center justify-center"
      style={{
        background: "linear-gradient(to bottom, rgba(133,173,175,0) 0%, rgba(133,173,175,1) 40%, rgba(133,173,175,1) 60%, rgba(133,173,175,0) 100%)"
      }}
    >
      <div className="absolute inset-0 opacity-75 flex items-center justify-center">
        <svg
          viewBox="0 0 910 793"
          fill="none"
          className="w-full h-full min-w-[900px]"
          style={{ transform: "scale(1.1)", transformOrigin: "center center" }}
        >
          <path
            ref={pathRef}
            d="M665.5 25C609.501 25 385 139.5 385 219C385 336.708 782.501 199.227 782.501 357.5C782.501 515.773 25 551.5 25 477.414C25 376 899 460.604 899 655.5C899 798 590.002 798 464.001 798"
            fill="none"
            stroke="rgba(231,243,244,1)"
            strokeWidth={40}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative grid gap-3 md:grid-cols-3">
        {steps.map((line, idx) => (
          <div
            key={line}
            className={clsx(
              "card-surface bg-white/75 p-6 backdrop-blur transition-all duration-300",
              idx === activeIndex ? "shadow-2xl" : "opacity-75",
            )}
          >
            <p className="text-h2 text-left leading-snug">{line}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

