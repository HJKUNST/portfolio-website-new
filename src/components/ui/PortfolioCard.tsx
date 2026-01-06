"use client";

import Image from "next/image";
import clsx from "clsx";
import styles from "./PortfolioCard.module.css";
import type { PortfolioCard } from "@/lib/portfolio/types";

type Props = {
  card: PortfolioCard;
  onClick?: () => void;
  className?: string;
};

export const PortfolioCardPreview = ({ card, onClick, className }: Props) => {
  const isEmpty = !card.image;

  return (
    <div
      className={clsx(
        "group relative flex-none overflow-hidden rounded-2xl h-full cursor-pointer hero-card",
        className
      )}
      data-cursor-hover
      style={{ aspectRatio: "4 / 3" }}
      onClick={onClick}
    >
      {card.image ? (
        <>
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover transition-all duration-300"
            priority
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {card.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-2xl text-body overflow-hidden"
                    style={{
                      color: "white",
                      boxShadow: "inset 0 4px 20px 0 rgba(210,210,210,0.25)",
                      borderRadius: "1rem",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3
                className="text-white font-semibold whitespace-pre-line"
                style={{
                  color: "white",
                  fontSize: "clamp(20px, 4vw, 36px)",
                }}
              >
                {card.title}
              </h3>
              {card.subtitle && (
                <p className={styles.subtitle} style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={clsx("absolute inset-0", styles.emptyCard)} />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: isEmpty
            ? "inset 0 0 50px 0 rgba(133,173,175,0.5)"
            : "inset 0 0 50px 0 rgba(133,173,175,1)",
        }}
      />
    </div>
  );
};
