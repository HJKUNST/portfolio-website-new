"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { PortfolioTeam } from "@/lib/figma/types";
import { Dialog } from "../ui/Dialog";

// ============================================
// Types (타입 정의)
// ============================================

type Props = {
  headline?: string;
  teams?: PortfolioTeam[];
};

type TeamCardProps = {
  team: PortfolioTeam;
  index: number;
  onClick: () => void;
};

// ============================================
// Constants (상수)
// ============================================

/** 카드 그리드 레이아웃 설정 */
const GRID_CONFIG = {
  paddingLeft: "120px",   // 왼쪽 여백
  paddingRight: "20px",   // 오른쪽 여백
  marginTop: "mt-20",     // 상단 여백 (Tailwind)
  gap: "-20px",           // 카드 간 간격 (겹침 효과)
};

/** 카드 섹션 배경 그라데이션 설정 */
const SECTION_BACKGROUND = {
  // 그라데이션 색상
  gradient: "radial-gradient(rgba(144,221,225,0.4) 0%, rgba(144,221,225,0.0) 70%)",
  // 크기
  width: "100%",          // 너비
  height: "80%",         // 높이
  // 중심 정렬 (카드 그리드 중심과 일치)
  top: "50%",             // 상단 기준점
  left: "60%",            // 왼쪽 기준점  
  offsetX: "50px",        // X축 오프셋 (그리드 padding 보정: (120-20)/2 = 50px)
  offsetY: "0px",         // Y축 오프셋
};

/** 각 카드별 기본 상태 설정 (y: 위치, rotate: 각도, scale: 크기) */
const CARD_INITIAL_STATES = [
  { y: 0, rotate: -10, scale: 1 },
  { y: 20, rotate: 4, scale: 1 },
  { y: -20, rotate: 8, scale: 1 },
  { y: 20, rotate: -6, scale: 1 },
];

/** 각 카드별 hover 애니메이션 설정 */
const CARD_HOVER_ANIMATIONS = [
  { y: 0, rotate: -14, scale: 1.01 },
  { y: 20, rotate: 8, scale: 1.01 },
  { y: -20, rotate: 12, scale: 1.01 },
  { y: 20, rotate: -10, scale: 1.01 },
];

/** 카드 애니메이션 전환 설정 */
const CARD_TRANSITION = {
  type: "spring" as const,
  stiffness: 120,  // 스프링 강도 (높을수록 빠름)
  damping: 20,     // 감쇠 (높을수록 덜 튕김)
};

/** 카드 이미지 오버레이 스타일 */
const CARD_OVERLAY_STYLE = {
  boxShadow: "inset 0 0 50px 0 #85adaf",
  border: "1px solid rgba(206,225,226,1)",
};

// ============================================
// Default Data (기본 데이터)
// ============================================

const DEFAULT_HEADLINE = "Teams that I've made great outputs with — small teams working in rhythm.";

const DEFAULT_TEAMS: PortfolioTeam[] = [
  {
    name: "EISEN Labs",
    image: "/1st.png",
    surfaces: ["DAPP"],
    industry: "DeFi",
    description: `Eisen is a multichain DEX aggregator on 20+ chains, expanding with V2 to support both CEX and DEX trading, including spot and derivatives.

Worked as a solo designer / marketer in the tech-focused defi startup, building every visual materials from zero to one including the dapp experience, landing page which had resulted product growth from $10K to $10M Daily.`,
  },
  {
    name: "HODL Bot",
    image: "/2nd.png",
    surfaces: ["Telegram Bot"],
    industry: "DeFi",
    description: `A Telegram-based trading assistant built on Hyperliquid, designed to unify Spot, Perp, and EVM trading into a single delta-neutral strategy interface. The bot automates hedging and funding-fee arbitrage, helping users reduce downside risk while capturing extra yield — all within a simple chat-based UX.

I led the UX and deck direction for the project, redesigning trading and balance flows to make multi-venue execution seamless. My work reduced task completion time by 43% and user errors by 35%, while improving overall clarity in the trading flow. I also organized and designed the full pitch deck narrative and visual system, which contributed to the team winning 3rd Place ($6K) at the Hyperliquid Hackathon.`,
  },
  {
    name: "TGIF : FX Hedge with Stablecoins",
    image: "/3rd.png",
    surfaces: ["DAPP"],
    industry: "DeFi",
    description: `TGIF is an FX hedging protocol built on a KRW-native stablecoin concept, developed by a technically strong team exploring how on-chain systems can replace slow, bank-centric currency risk management for merchants and enterprises.

I led the product narrative and UX, structuring the entire deck and translating complex FX hedging logic into clear user flows. My work focused on making the protocol's mechanisms understandable, usable, and trustworthy, contributing to a 2nd Place ($12K) finish.`,
  },
  {
    name: "Be My Next Teammates!",
    image: "/4th.png",
  },
];

// ============================================
// Sub Components (서브 컴포넌트)
// ============================================

/** 팀 카드 컴포넌트 */
const TeamCard = ({ team, index, onClick }: TeamCardProps) => {
  const initialState = CARD_INITIAL_STATES[index % 4];
  const hoverAnimation = CARD_HOVER_ANIMATIONS[index % 4];
  // z-index: 첫 번째 카드가 가장 위에 오도록 (index 0 → z-index 10, index 1 → z-index 9, ...)
  const zIndex = 10 - index;

  return (
    <motion.button
      onClick={onClick}
      className="relative w-full aspect-square overflow-hidden rounded-3xl text-left shadow-lg"
      style={{ zIndex }}
      initial={initialState}
      whileHover={hoverAnimation}
      transition={CARD_TRANSITION}
    >
      {team.image ? (
        <>
          <Image
            src={team.image}
            alt={team.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* 이미지 오버레이 (inset shadow + border) */}
          <div className="absolute inset-0" style={CARD_OVERLAY_STYLE} />
        </>
      ) : (
        /* 이미지 없을 때 플레이스홀더 */
        <div className="absolute inset-0 bg-[rgba(206,225,226,0.2)] backdrop-blur-md border-[rgb(206,225,226)] border-1" />
      )}
    </motion.button>
  );
};

/** 팀 상세 다이얼로그 컴포넌트 */
const TeamDialog = ({
  team,
  onClose,
}: {
  team: PortfolioTeam | null;
  onClose: () => void;
}) => {
  if (!team) return null;

  return (
    <Dialog
      open={!!team}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title=""
      description={team.detail}
      trigger={<span className="sr-only">open</span>}
    >
      <div style={{ color: "white" }}>
        {/* Header row: Title (left) | Industry & Surfaces (right) */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          {/* Title - left aligned, can wrap */}
          <h2 className="text-h2 text-left min-w-0" style={{ color: "inherit" }}>{team.name}</h2>

          {/* Industry | Surfaces - right aligned */}
          <div className="flex items-center gap-2 text-body text-right flex-wrap justify-end shrink-0" style={{ color: "inherit" }}>
            {team.industry && <span>{team.industry}</span>}
            {team.industry && team.surfaces && team.surfaces.length > 0 && (
              <span>|</span>
            )}
            {team.surfaces && team.surfaces.length > 0 && (
              <>
                {team.surfaces.map((surface, idx) => (
                  <span key={surface} className="flex items-center gap-2">
                    {idx > 0 && <span>-</span>}
                    {surface}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {team.description && (
          <p className="text-body mt-20 mb-4 whitespace-pre-line" style={{ color: "inherit" }}>{team.description}</p>
        )}
      </div>
    </Dialog>
  );
};

// ============================================
// Main Component (메인 컴포넌트)
// ============================================

export const TeamsSection = ({
  headline = DEFAULT_HEADLINE,
  teams = DEFAULT_TEAMS
}: Props) => {
  // 팀 데이터
  const cards = useMemo(() => teams, [teams]);

  // 선택된 팀 상태 (다이얼로그용)
  const [selectedTeam, setSelectedTeam] = useState<PortfolioTeam | null>(null);

  return (
    <section className="section-shell overflow-visible relative" style={{ paddingBottom: "0px", minHeight: "auto" }}>
      {/* 섹션 배경 그라데이션 */}
      <div
        className="absolute pointer-events-none"
        style={{
          background: SECTION_BACKGROUND.gradient,
          width: SECTION_BACKGROUND.width,
          height: SECTION_BACKGROUND.height,
          top: SECTION_BACKGROUND.top,
          left: SECTION_BACKGROUND.left,
          transform: `translate(calc(-50% + ${SECTION_BACKGROUND.offsetX}), calc(-50% + ${SECTION_BACKGROUND.offsetY}))`,
          zIndex: 0,
        }}
      />

      {/* 섹션 헤더 */}
      <p
        className="text-h3-em mb-[48px]"
        style={{
          background: "none",
          WebkitBackgroundClip: "unset",
          backgroundClip: "unset",
          color: "var(--gray-300)",
        }}
      >{`// Teams that I've made great outputs with`}</p>
      <p
        className="my-6 text-h2 text-gray-900 leading-snug w-[50%] pb-[8%]"
      >
        I believe the strongest products are built through{" "}
        <span className="text-h2-em text-secondary align-baseline" style={{ lineHeight: 0.9 }}>shared craft</span>
        {" "}— small teams working in rhythm, shaping and refining until the surface finally holds.
      </p>

      {/* 카드 그리드 */}
      <div
        className={`${GRID_CONFIG.marginTop} relative w-full grid sm:grid-cols-2 lg:grid-cols-4 justify-items-center `}
        style={{
          paddingLeft: GRID_CONFIG.paddingLeft,
          paddingRight: GRID_CONFIG.paddingRight,
          gap: GRID_CONFIG.gap,
          zIndex: 1,
        }}
      >
        {cards.map((team, idx) => (
          <TeamCard
            key={team.name}
            team={team}
            index={idx}
            onClick={() => setSelectedTeam(team)}
          />
        ))}
      </div>

      {/* 팀 상세 다이얼로그 */}
      <AnimatePresence>
        <TeamDialog team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      </AnimatePresence>
    </section>
  );
};
