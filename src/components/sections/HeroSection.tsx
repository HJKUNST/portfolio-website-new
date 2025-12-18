"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { PortfolioCard } from "@/lib/figma/types";
import { getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";
import styles from "./HeroSection.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

const CARD_STYLE_WIDTH = "clamp(370px, 33vw, 640px)";
const CARD_BASE_WIDTH = 480;
const GAP = 8;
const STEP_BASE = Math.round(CARD_BASE_WIDTH * 0.75 + GAP);

type Props = {
  headline: string;
  tags: string[];
  cards: PortfolioCard[];
};

type PaddedCard =
  | (PortfolioCard & { _key: string })
  | {
    _key: string;
    placeholder: true;
  };

export const HeroSection = ({ headline, tags, cards }: Props) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef(1);
  const [index, setIndex] = useState(0);
  const STEP = STEP_BASE;
  const marqueeText = useMemo(() => tags.join(" · "), [tags]);
  const cardImages = useMemo(
    () => ({
      "EISEN Labs": "/eisen app.png",
      "Graphic Design & Marketing": "/eisen graphic.png",
      "Hyperliquid Portal": "/hodl.png",
      "Hedging the FX Market": "/tgif.png",
      default: "/tgif.png",
    }),
    [],
  );

  const heroCards = useMemo(() => {
    const base =
      cards.length > 0
        ? cards
        : [
          { title: "EISEN Labs", subtitle: "Pump your profit potential" },
          { title: "Finance Marketing", subtitle: "Works of Eisen" },
          { title: "Hyperliquid Portal", subtitle: "No unified path to trade" },
          { title: "Hedging the FX Market", subtitle: "KRW native stables to hedge FX risk" },
        ];
    return base.map((card, idx) => ({
      ...card,
      image: card.image ?? cardImages[card.title as keyof typeof cardImages] ?? cardImages.default,
      _key: `${card.title}-${idx}`,
    }));
  }, [cardImages, cards]);

  const paddedCards = useMemo(() => {
    if (heroCards.length === 0) return [];
    const first = heroCards[0];
    const last = heroCards[heroCards.length - 1];
    return [
      { ...last, _key: `${last._key}-clone-last` } satisfies PaddedCard,
      ...heroCards,
      { ...first, _key: `${first._key}-clone-first` } satisfies PaddedCard,
    ];
  }, [heroCards]);

  const FIRST = 1;
  const LAST = Math.max(heroCards.length, 1);

  const animateStep = useCallback(
    (delta: number) => {
      if (!trackRef.current) return;
      const gsap = getGSAP();
      const current = indexRef.current;
      const visualTarget = Math.min(Math.max(current + delta, 0), LAST + 1);
      const snapIndex = visualTarget > LAST ? FIRST : visualTarget < FIRST ? LAST : visualTarget;

      const handleSnap = () => {
        if (!trackRef.current) return;
        trackRef.current.style.transform = `translateX(${-snapIndex * STEP}px)`;
        indexRef.current = snapIndex;
        setIndex(snapIndex);
      };

      if (!gsap || prefersReducedMotion()) {
        handleSnap();
        return;
      }

      gsap.killTweensOf(trackRef.current);

      gsap.to(trackRef.current, {
        x: -visualTarget * STEP,
        duration: 0.6,
        ease: "power2.out",
        onComplete: handleSnap,
      });
    },
    [FIRST, LAST, STEP],
  );

  const handleNext = useCallback(() => animateStep(1), [animateStep]);
  const handlePrev = useCallback(() => animateStep(-1), [animateStep]);

  useEffect(() => {
    // Reset position when data changes
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(${-FIRST * STEP}px)`;
    indexRef.current = FIRST;
    setIndex(FIRST);
  }, [FIRST, STEP, heroCards]);

  return (
    <section className="section-shell flex flex-col">
      <div className="flex flex-col gap-3">
        <p className="text-h3-em">{headline}</p>
        <div className={clsx(styles.marqueeWrapper, "text-body text-gray-500")} aria-label={marqueeText}>
          <div className={styles.marqueeContent}>
            {[0, 1].map((i) => (
              <span key={i} className={styles.marqueeText}>
                {marqueeText}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden" style={{ height: "min(70vh, 720px)" }}>
        <div className="flex h-full items-stretch gap-4" ref={trackRef} style={{ width: "max-content" }}>
          {paddedCards.map((card) =>
            "placeholder" in card ? (
              <div
                key={card._key}
                className="flex-none"
                style={{ height: "100%", aspectRatio: "4 / 3", minWidth: "370px" }}
                aria-hidden
              />
            ) : (
              <HeroCard key={card._key} card={card} />
            ),
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="flex items-center gap-2px-4"
          onClick={handlePrev}
          aria-label="Previous"
        >
          <ChevronLeftIcon aria-hidden />
        </button>
        <button
          className="flex items-center gap-2px-4"
          onClick={handleNext}
          aria-label="Next"
        >
          <ChevronRightIcon aria-hidden />
        </button>
      </div>
    </section>
  );
};

const HeroCard = ({
  card,
}: {
  card: PortfolioCard;
}) => {
  return (
    <div
      className={clsx(
        "relative flex h-full flex-none flex-col justify-end overflow-hidden rounded-sm",
      )}
      style={{ height: "100%", aspectRatio: "4 / 3", minWidth: "370px" }}
    >
      {card.image ? (
        <Image src={card.image} alt={card.title} fill className="object-cover" priority />
      ) : null}
      <div className="relative z-10 p-6 flex flex-col gap-2">
      </div>
    </div>
  );
};

