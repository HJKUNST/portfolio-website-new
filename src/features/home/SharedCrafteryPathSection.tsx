"use client";

import { useEffect, useRef } from "react";
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
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]); // 카드 요소 참조
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const isManualScrollRef = useRef(false);

  // 현재 활성화된 인덱스를 추적 (Ref로 관리하여 리렌더링 방지)
  const activeIndexRef = useRef(0);

  // 카드 활성화 상태 업데이트 함수 (DOM 직접 조작)
  const updateActiveCard = (index: number) => {
    if (activeIndexRef.current === index) return;

    activeIndexRef.current = index;

    // 모든 카드의 active 클래스 제거 및 현재 카드에 추가
    cardRefs.current.forEach((card, i) => {
      if (card) {
        if (i === index) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      }
    });
  };

  useEffect(() => {
    const gsap = getGSAP();
    if (!gsap || !ScrollTrigger || prefersReducedMotion()) return;
    if (!pathRef.current || !containerRef.current || !cardsContainerRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();
    const mm = gsap.matchMedia();

    // 초기 설정: 경로를 보이지 않게
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    // 초기 로드시 첫 번째 카드 활성화
    updateActiveCard(0);

    // 공통 ScrollTrigger 설정 생성 함수
    const createScrollConfig = () => ({
      trigger: containerRef.current,
      start: "top 10%",       // 섹션 상단이 뷰포트 10% 지점에 닿을 때 시작
      end: "+=80%",           // 스크롤 60vh 동안 애니메이션 진행 (더 짧은 구간 = 더 빠른 진행)
      pin: true,              // 섹션을 고정
      pinSpacing: true,       // 고정 후 공간 확보
      scrub: 0.5,             // 스크롤과 부드럽게 동기화 (0.5초 딜레이 - 더 빠릿한 반응)
      onUpdate: (self: ScrollTrigger) => {
        // 수동 스크롤 중이면 업데이트하지 않음 (충돌 방지)
        if (isManualScrollRef.current) return;

        // 카드 활성화 상태 업데이트 (Progress에 따라 계산)
        const progress = self.progress;
        let newIndex = 0;

        if (progress < 0.33) newIndex = 0;
        else if (progress < 0.67) newIndex = 1;
        else newIndex = 2;

        updateActiveCard(newIndex);
      },
    });

    // Responsive Animations
    mm.add({
      // Mobile (< 768px): Path drawing + Card Container Translation (Centering)
      isMobile: "(max-width: 767px)",
      // Desktop (>= 768px): Path drawing only
      isDesktop: "(min-width: 768px)",
    }, (context) => {
      const { isMobile } = context.conditions as { isMobile: boolean };
      const config = createScrollConfig();

      if (isMobile) {
        // 모바일: 타임라인으로 Path와 Container 이동 동기화
        const tl = gsap.timeline({
          scrollTrigger: config
        });

        // 1. Path Drawing
        tl.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          duration: 1
        }, 0);

        // 2. Card Container Translation
        // 마지막 카드가 뷰포트 중앙/상단부로 오게 함 (약 -66.6% 이동)
        tl.to(cardsContainerRef.current, {
          yPercent: -66.6,
          ease: "none",
          duration: 1
        }, 0);

        scrollTriggerRef.current = tl.scrollTrigger || null;
      } else {
        // 데스크탑: Path Drawing만 수행
        const tween = gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: config
        });
        scrollTriggerRef.current = tween.scrollTrigger || null;
      }
    });

    return () => {
      mm.revert();
    };
  }, []);

  // 카드 클릭 핸들러 - 해당 카드로 스크롤 이동
  const handleCardClick = (index: number) => {
    // 모바일에서는 클릭 비활성화
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const card = cardRefs.current[index];
    if (!card || !containerRef.current) return;

    // 즉시 해당 카드를 활성화 (반응성 향상)
    updateActiveCard(index);
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

    // ScrollTrigger를 사용하여 정확한 스크롤 위치 계산
    const targetProgress = index / (steps.length - 1);
    const triggerStart = scrollTrigger.start as number;
    const triggerEnd = scrollTrigger.end as number;
    const scrollRange = triggerEnd - triggerStart;
    const targetScroll = triggerStart + (scrollRange * targetProgress);

    // 부드러운 스크롤 애니메이션
    const startY = window.scrollY;
    const distance = targetScroll - startY;
    const duration = 0.8;
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Easing 함수
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
          // 스크롤 완료 후 혹시 모를 오차 보정
          updateActiveCard(index);
        }, 200);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <div className="w-full max-w-[100vw] relative overflow-hidden">
      <section
        ref={containerRef}
        className="relative section-shell flex flex-col items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, rgba(136,195,198,0) 0%, rgba(136,195,198,1) 40%, rgba(136,195,198,1) 60%, rgba(136,195,198,0) 100%)"
        }}>
        <p
          className="text-h3-em mb-[48px] self-start md:!text-white md:!bg-none md:!bg-clip-border"
        >{`//  Vision that I take my work towards`}</p>

        {/* SVG 컨테이너: pointer-events-none으로 클릭 방해 방지, z-index 0 */}
        <div className="absolute inset-0 opacity-75 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
          <svg
            viewBox="0 0 910 793"
            fill="none"
            // min-w-[900px] 유지하되 부모 overflow-hidden으로 가로 스크롤 방지
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

        <div
          className="w-full relative overflow-hidden py-4"
          style={{
            zIndex: 1,
          }}
        >
          <div
            ref={cardsContainerRef}
            className="relative grid md:grid-cols-3 border border-white/50"
          >
            {steps.map((line, idx) => (
              <div
                key={line}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                // 초기 active 상태는 0번 인덱스만 (서버 사이드 렌더링 매칭을 위해 clsx 조건부 유지하지만, 실제 동작은 DOM 조작으로 덮어씌워짐)
                // 모바일에서는 커서 기본값, 데스크탑(md) 이상에서만 포인터
                className={clsx("card-shell cursor-default md:cursor-pointer", idx === 0 && "active")}
                data-cursor-focus
                onClick={() => handleCardClick(idx)}
              >
                <p
                  className="text-h2 text-left leading-snug flex-1"
                  style={{
                    color: 'white',
                  }}
                >{line}</p>
                <svg className="self-end mt-auto" width="78" height="79" viewBox="0 0 78 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="75.9434" y1="39.3552" x2="5.79323e-05" y2="39.3552" stroke="white" strokeWidth="2" />
                  <line x1="75.2363" y1="39.0623" x2="36.881" y2="0.707122" stroke="white" strokeWidth="2" />
                  <line x1="76.6505" y1="39.0623" x2="38.2953" y2="77.4175" stroke="white" strokeWidth="2" />
                </svg>

              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
