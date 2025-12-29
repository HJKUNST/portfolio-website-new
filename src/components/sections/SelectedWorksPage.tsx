"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { getGSAP, ScrollTrigger } from "@/lib/motion/gsap";

const TitleStyle = {
  fontFamily: "var(--font-manrope), Manrope, sans-serif",
  fontSize: "clamp(28px, 3.5vw, 40px)",
  fontWeight: 500,
  letterSpacing: "-0.02em",
  lineHeight: "1.6em",
};

const BodyStyle = {
  color: "var(--gray-300)",
  lineHeight: "1.6em",
  fontSize: "clamp(18px, 2.5vw, 24px)",
};

const subtitleStyle = {
  fontFamily: "var(--font-manrope), Manrope, sans-serif",
  fontSize: "clamp(18px, 1.6vw, 20px)",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: "1.6em",
  background: "var(--main-gradient)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

type WorkItem = {
  id: string;
  year: string;
  title: string;
  description?: string;
  image: string;
};

const works: WorkItem[] = [
  {
    id: "eisen-trading",
    year: "2025",
    title: "EISEN – On-Chain + CEX Trading Interface Made Clear",
    description: "Works of Eisen : Graphics, Data, Performance\n3rd Place on Hyperliquid Hackathon : HODL BOT Pitch Deck\nKorea Stablecoin Hackathon : TGIF - KRW Stablecoin based FX Hedge",
    image: "/eisen-trading-interface.png",
  },
  {
    id: "works-of-eisen-1",
    year: "2025",
    title: "Works of Eisen : Graphics, Data, Performance",
    image: "/works-of-eisen-1.png",
  },
  {
    id: "works-of-eisen-2",
    year: "2025",
    title: "Works of Eisen : Graphics, Data, Performance",
    image: "/works-of-eisen-2.png",
  },
];

export const SelectedWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gsap = getGSAP();
    if (!gsap || !leftColRef.current || !containerRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top+=128", // md:top-32 equivalence
        end: "bottom bottom",
        pin: leftColRef.current,
        pinSpacing: false, // Right column determines height, left one floats
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      className="section-shell max-w-[1280px] mx-auto pb-24 px-5 md:px-10"
      style={{ background: "#FCFCFC", paddingTop: "160px" }}
    >
      {/* 1:1 Grid Layout with Fixed Left, Scrollable Right */}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {/* Left Column: Fixed (Title, Description, Work List) */}
        <div ref={leftColRef}>
          {/* Main Title */}
          <h1
            className="text-h1-gradient mb-4"
            style={TitleStyle}
          >
            Selected Works
          </h1>

          {/* Description */}
          <p
            className="text-em mb-16"
            style={{
              ...BodyStyle,
              maxWidth: "505px",
            }}
          >
            I design clarity for complex financial products—across interfaces, data, and performance. Excited about what we can build together.
          </p>

          <div className="space-y-8">
            {works.map((work) => (
              <div key={work.id}>
                <div className="flex gap-3 mb-2">
                  <span
                    className="text-em"
                    style={{
                      ...BodyStyle,
                      color: "var(--gray-900)",
                      fontWeight: 500,
                      minWidth: "33px",
                    }}
                  >
                    {work.year}
                  </span>
                  <h3
                    className="text-em"
                    style={{
                      ...subtitleStyle,
                      color: "var(--gray-900)",
                      fontWeight: 500,
                      background: "none",
                      WebkitBackgroundClip: "border-box",
                      backgroundClip: "border-box",
                    }}
                  >
                    {work.title}
                  </h3>
                </div>
                {work.description && (
                  <p
                    className="text-em ml-[49px] whitespace-pre-line"
                    style={{
                      ...BodyStyle,
                      opacity: 0.5,
                    }}
                  >
                    {work.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Scrollable Cards */}
        <div className="flex flex-col gap-8">
          {works.map((work) => (
            <div key={work.id} className="relative">
              {/* Work Image Card */}
              <div
                className="relative w-full aspect-[546/427] overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover"
                  priority={work.id === "eisen-trading"}
                  quality={85}
                />
              </div>

              {/* Work Info (visible on desktop, below image) */}
              <div className="mt-4 flex justify-between items-end">
                <p
                  className="text-em"
                  style={{
                    color: "var(--gray-900)",
                    fontSize: "clamp(10px, 1.2vw, 12px)",
                    lineHeight: "1.366em",
                    maxWidth: "285px",
                  }}
                >
                  {work.title}
                </p>
                <p
                  className="text-em text-right"
                  style={{
                    color: "var(--gray-900)",
                    fontSize: "clamp(10px, 1.2vw, 12px)",
                    lineHeight: "1.366em",
                  }}
                >
                  {work.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
