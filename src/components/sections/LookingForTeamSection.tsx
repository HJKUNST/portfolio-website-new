"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { ScrollTrigger, getGSAP } from "@/lib/motion/gsap";
import { DEFAULT_EASE, MICRO_FAST, prefersReducedMotion } from "@/lib/motion/constants";

// ============================================
// Types (타입 정의)
// ============================================

type Props = {
  /** 메인 헤드라인 텍스트 */
  headline?: string;
  /** 강조되는 서브 헤드라인 텍스트 */
  subheadline?: string;
  /** 연락처 섹션 라벨 */
  contactLabel?: string;
  /** 소셜 아이콘 목록 */
  icons?: { href: string; label: string; icon: string }[];
};

// ============================================
// Default Data (기본 데이터)
// ============================================

const DEFAULT_HEADLINE = "I'm looking for a team that builds in that cadence. I bring the machinery, the craft, and the ability";
const DEFAULT_SUBHEADLINE = "to help many hands align toward one clear product.";
const DEFAULT_CONTACT_LABEL = "Contact Me";

const DEFAULT_ICONS = [
  { href: "https://www.linkedin.com/in/laura-hj-kim-a761b8223/", label: "LinkedIn", icon: "/linkedin.svg" },
  { href: "https://github.com/HJKUNST", label: "Github", icon: "/github.svg" },
  { href: "https://t.me/lkkunst1", label: "Telegram", icon: "/telegram.svg" },
  { href: "mailto:lkkunst1@gmail.com", label: "Email", icon: "/mail.svg" },
];

// ============================================
// Sub Components (서브 컴포넌트)
// ============================================

/**
 * 텍스트 애니메이션을 위한 단어/글자 단위 분리 컴포넌트
 * - 각 단어와 글자를 span으로 감싸서 개별 애니메이션 제어 가능하도록 함
 */
const AnimatedText = ({
  text,
  isHighlight = false,
  baseIndex = 0,
  pushRef,
}: {
  text: string;
  isHighlight?: boolean;
  baseIndex: number;
  pushRef: (el: HTMLSpanElement | null) => void;
}) => {
  // 단어 단위로 분리
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <>
      {words.map((word, wordIdx) => {
        // 현재 단어 이전까지의 글자 수 계산 (전역 인덱스 계산용)
        const previousCharsCount = words.slice(0, wordIdx).join(" ").length + (wordIdx > 0 ? 1 : 0);

        return (
          <span
            key={`${isHighlight ? "high" : "std"}-word-${wordIdx}`}
            className={`inline-block ${isHighlight ? "text-h2-em text-secondary align-baseline" : ""
              }`}
            style={isHighlight ? { lineHeight: 0.9 } : undefined}
          >
            {word.split("").map((letter, letterIdx) => {
              // 전체 텍스트 내에서의 고유 인덱스
              // const globalIdx = baseIndex + previousCharsCount + letterIdx; // (애니메이션 사용 시 필요)

              return (
                <span
                  key={`${isHighlight ? "high" : "std"}-letter-${wordIdx}-${letterIdx}`}
                  ref={pushRef}
                  className="inline-block"
                >
                  {letter}
                </span>
              );
            })}
            {/* 단어 사이 공백 추가 */}
            {wordIdx < words.length - 1 && "\u00A0"}
          </span>
        );
      })}
    </>
  );
};

/**
 * 소셜 아이콘 목록 컴포넌트
 */
const ContactIcons = ({ icons }: { icons: typeof DEFAULT_ICONS }) => (
  <div className="flex flex-wrap gap-1">
    {icons.map((icon) => (
      <a
        key={icon.href}
        href={icon.href}
        target="_blank"
        rel="noreferrer"
        className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-100 bg-[rgba(206,225,226,0.2)] text-gray-900 transition hover:-translate-y-1"
        aria-label={icon.label}
      >
        <Image
          src={icon.icon}
          alt={icon.label}
          width={24}
          height={24}
          className="object-contain"
        // style={{ filter: "brightness(0) saturate(100%)" }} // 아이콘 색상 조정 필요시 활성화
        />
      </a>
    ))}
  </div>
);

// ============================================
// Main Component (메인 컴포넌트)
// ============================================

export const LookingForTeamSection = ({
  headline = DEFAULT_HEADLINE,
  subheadline = DEFAULT_SUBHEADLINE,
  contactLabel = DEFAULT_CONTACT_LABEL,
  icons = DEFAULT_ICONS,
}: Props) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  // 애니메이션을 위해 ref 배열에 요소 추가하는 함수
  const addToRefs = (el: HTMLSpanElement | null) => {
    if (el && !lettersRef.current.includes(el)) {
      lettersRef.current.push(el);
    }
  };

  /* 
   * GSAP 애니메이션 (현재는 주석 처리됨)
   * 나중에 다시 활성화하려면 아래 주석을 해제하세요.
   */
  /*
  useEffect(() => {
    const gsap = getGSAP();
    if (!gsap || !ScrollTrigger || prefersReducedMotion()) return;
    if (!sectionRef.current) return;

    // 기존 ref 초기화 (중복 방지)
    // lettersRef.current = []; // 필요시 초기화 로직 추가

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(lettersRef.current, {
      y: -40,
      opacity: 0,
      stagger: 0.035,
      ease: DEFAULT_EASE,
      duration: MICRO_FAST + 0.2,
    }).from(
      ctaRef.current,
      { opacity: 0, y: 16, duration: MICRO_FAST },
      "-=0.2",
    );

    return () => {
      tl.kill();
    };
  }, []);
  */

  return (
    <section
      ref={sectionRef}
      className="section-shell flex flex-col items-center justify-center relative overflow-auto"
      style={{ minHeight: "10vh", background: "transparent", paddingBottom: "6rem" }}
    >
      <div className="my-6 pb-[8%] flex flex-col items-center">
        {/* 
          헤드라인 텍스트 영역 
          - 모바일: w-full (꽉 차게)
          - 데스크탑: w-[70%] (기존 디자인 유지)
        */}
        <p className="text-h2 text-gray-900 leading-snug w-full md:w-[80%] sm:w-[100%] mb-8 text-center">
          {/* 기본 텍스트 */}
          <AnimatedText
            text={headline}
            baseIndex={0}
            pushRef={addToRefs}
          />
          {" "}
          {/* 강조 텍스트 (서브 헤드라인) */}
          <AnimatedText
            text={subheadline}
            isHighlight
            baseIndex={headline.length}
            pushRef={addToRefs}
          />
        </p>

        {/* 하단 CTA (Contact Me) 영역 */}
        <div ref={ctaRef} className="flex flex-col items-center gap-4">
          <span className="text-h4 uppercase tracking-[0.08em]">
            {contactLabel}
          </span>
          <ContactIcons icons={icons} />
        </div>
      </div>

      {/* 배경 그라데이션 효과 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[500px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse 1200px 500px at 50% 100%, rgba(136,195,198,0.4) 0%, rgba(136,195,198,0) 100%)',
          maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
        }}
      />
    </section>
  );
};


