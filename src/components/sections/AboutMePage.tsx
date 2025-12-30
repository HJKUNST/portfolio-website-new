"use client";

import Image from "next/image";
import { useEffect, useRef, forwardRef } from "react";
import { getGSAP, ScrollTrigger } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

const TitleStyle = {
  fontFamily: "var(--font-manrope), Manrope, sans-serif",
  fontSize: "clamp(28px, 3.5vw, 40px)",
  fontWeight: 500,
  letterSpacing: "-0.02em",
  lineHeight: "1.4em",
};

const BodyStyle = {
  color: "var(--gray-300)",
  lineHeight: "1.4em",
  fontSize: "clamp(16px, 1.6vw, 20px)",
};

const subtitleStyle = {
  fontFamily: "var(--font-manrope), Manrope, sans-serif",
  fontSize: "clamp(18px, 1.6vw, 20px)",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: "1.4em",
  background: "var(--main-gradient)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

// Reusable Components
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-h2 mb-8" style={TitleStyle}>
    {children}
  </h2>
);

const SectionSubtitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-h3-em mb-3 ${className}`} style={subtitleStyle}>
    {children}
  </h3>
);

const SectionBody = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-em ${className}`} style={BodyStyle}>
    {children}
  </p>
);

const ContentSection = forwardRef<HTMLDivElement, { title: string; children: React.ReactNode; className?: string }>(
  ({ title, children, className }, ref) => (
    <div ref={ref} className={className}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  )
);
ContentSection.displayName = "ContentSection";

const TechStackItem = ({ items }: { items: string }) => {
  const itemList = items.split('\n').filter(item => item.trim());

  return (
    <div className="flex flex-col">
      {itemList.map((item, index) => (
        <span
          key={index}
          className="text-em whitespace-nowrap"
          style={BodyStyle}
        >
          {item.trim()}
        </span>
      ))}
    </div>
  );
};

export const AboutMeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current) return;

    const gsap = getGSAP();
    if (!gsap || !ScrollTrigger) return;

    const mm = gsap.matchMedia();

    // Pinning Logic - Pin left column while right column scrolls
    mm.add("(min-width: 1024px)", () => {
      if (containerRef.current && leftColRef.current && rightColRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top", // Start when section enters viewport
          end: () => {
            const rightHeight = rightColRef.current?.offsetHeight || 0;
            const leftHeight = leftColRef.current?.offsetHeight || 0;
            const scrollDistance = Math.max(0, rightHeight - leftHeight);

            const containerTop = containerRef.current?.offsetTop || 0;
            const sectionTop = sectionRef.current?.offsetTop || 0;
            const relativeTop = containerTop - sectionTop;

            return `+=${relativeTop + scrollDistance}`;
          },
          pin: leftColRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }
    });

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

    // Content sections animation
    contentRefs.current.forEach((ref, index) => {
      if (!ref) return;

      if (index === 0) {
        // Left Column (Photo) - Keep original entrance or simple fade
        gsap.fromTo(
          ref,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else {
        // Right Column Items - Focus Effect (Opacity 0.2 -> 1 when in center)
        gsap.fromTo(
          ref,
          { opacity: 0.2 },
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref,
              start: "top 70%", // Enter focus area
              end: "bottom 30%", // Leave focus area
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-shell max-w-[1280px] mx-auto pb-24 px-5 md:px-10"
      style={{ background: "#FCFCFC", paddingTop: "120px", paddingBottom: "160px" }}
    >
      {/* 1:1 Grid Layout */}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
        {/* Left Column: Title + Photo */}
        <div
          ref={leftColRef}
          className="flex flex-col gap-16"
        >
          {/* Main Title - Moved inside Left Column */}
          <h1
            ref={titleRef}
            className="text-h1-gradient"
            style={TitleStyle}
          >
            Laura Heejoo Kim
          </h1>

          {/* Photo */}
          <div
            ref={(el) => {
              contentRefs.current[0] = el;
            }}
            className="relative w-full md:w-[25vw] md:min-w-[24rem] aspect-[295/393] mx-auto md:mx-0"
          >
            <Image
              src="/about-me-3.png"
              alt="Laura Heejoo Kim"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Column: About Me + Mindset + Software + Education + Hobbies */}
        <div ref={rightColRef} className="flex flex-col gap-16 mt-20">
          {/* About Me Content */}
          <ContentSection
            title="About Me"
            ref={(el) => {
              contentRefs.current[1] = el;
            }}
          >
            <SectionBody>
              Hi, I'm Laura, a Product Designer working at the intersection of design, engineering, and finance. I specialize in taking complex trading logic and multi-chain systems and shaping them into interfaces that feel clear, trustworthy, and usable. My experience spans both on-chain and CEX trading products, system modeling, and data-informed iteration across web3 applications.
            </SectionBody>
          </ContentSection>

          {/* Mindset Section */}
          <ContentSection
            title="Mindset"
            ref={(el) => {
              contentRefs.current[2] = el;
            }}
          >
            <div className="space-y-8">
              <div>
                <SectionSubtitle>Team-Driven, Thinking in Systems</SectionSubtitle>
                <SectionBody>
                  Design works best as a team sport. Start with shared goals, constraints, and system context—screens come later. Decisions stay grounded when product, engineering, and design move in the same frame.
                </SectionBody>
              </div>
              <div>
                <SectionSubtitle>Giving Shape to What's Not Yet Defined</SectionSubtitle>
                <SectionBody>
                  Undefined, technically dense products are the fun ones. Information architecture, states, and edge cases come before UI. The work is about giving systems a shape people can recognize, use, and trust.
                </SectionBody>
              </div>

              <div>
                <SectionSubtitle>Build, Craft, and Refine with Rigor</SectionSubtitle>
                <SectionBody>
                  Assumptions don't scale—data does. Analytics and dashboards guide iteration, not gut feeling. Technical architecture gets translated across interfaces, decks, and brand assets, keeping the story consistent from protocol to pixel.
                </SectionBody>
              </div>
            </div>
          </ContentSection>

          {/* Software Section */}
          <ContentSection
            title="Software"
            ref={(el) => {
              contentRefs.current[3] = el;
            }}
          >
            <div
              className="grid grid-cols-2 md:grid-cols-4"
              style={{
                gap: "clamp(16px, 4vw, 120px)",
              }}
            >
              <TechStackItem items={`Figma
                Framer
                GA4
                Lottie
                Maze`} />
              <TechStackItem items={`Adobe Suite
                Illustrator
                Photoshop
                After Effect
                XD
                `} />
              <TechStackItem items={`Git
                HTML
                CSS
                Tailwind
                Javascript`} />
              <TechStackItem items={`Storybook
                Protopie
                Blender`} />
            </div>
          </ContentSection>

          {/* Education Section */}
          <ContentSection
            title="Education"
            ref={(el) => {
              contentRefs.current[4] = el;
            }}
          >
            <SectionSubtitle>
              Hongik University, Seoul, South Korea<br />
              B.A. in Art Theory & Business Administration (Double Major)
            </SectionSubtitle>
            <SectionBody className="whitespace-pre-line">
              {`Relevant Coursework: Computational Thinking, Web Programming, Business Programming, Investment Theory, Art Criticism, Business Administration`}
            </SectionBody>
          </ContentSection>

          {/* Hobbies Section */}
          <ContentSection
            title="Hobbies"
            ref={(el) => {
              contentRefs.current[5] = el;
            }}
          >
            <SectionBody className="whitespace-pre-line">
              {`Making New Stuffs such as...
              
              Anatomy Sketch,
              Pottery,
              Ballet,
              Savoring Performing Arts`}
            </SectionBody>
          </ContentSection>

          {/* Work Experience Section */}
          <ContentSection
            title="Work Experience"
            ref={(el) => {
              contentRefs.current[6] = el;
            }}
          >
            <div className="space-y-6">
              <div>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                  <div>
                    <a
                      href="https://eisenfinance.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <h3 className="text-h3-em mb-0" style={subtitleStyle}>
                        Eisen Finance
                      </h3>
                    </a>
                    <SectionBody className="!mt-1 italic">
                      Product Designer
                    </SectionBody>
                  </div>
                  <SectionBody className="!text-[var(--gray-900)] md:text-right">
                    Feb 2024 - Present
                  </SectionBody>
                </div>
                <div className="space-y-2">
                  <SectionBody className="list-disc list-inside">
                    Eisen is a multichain DEX aggregator on 20+ chains, expanding with V2 to support both CEX and DEX trading, including spot and derivatives. Worked as a solo designer / marketer in the tech-focused defi startup, building every visual materials from zero to one including the dapp experience, landing page which had resulted product growth from $10K to $10M daily.
                  </SectionBody>
                </div>
              </div>
            </div>
          </ContentSection>

          {/* Awards Section */}
          <ContentSection
            title="Awards"
            ref={(el) => {
              contentRefs.current[7] = el;
            }}
            className="pb-40"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-h3-em mb-1" style={subtitleStyle}>
                  Korea Stablecoin Hackathon - 2nd Place (Sep 2025)
                </h3>
                <SectionBody>
                  UX for TGIF, KRW-stablecoin hedging protocol
                </SectionBody>
              </div>
              <div>
                <h3 className="text-h3-em mb-1" style={subtitleStyle}>
                  Hyperliquid Hackathon - 3rd Place (Sep 2025)
                </h3>
                <SectionBody>
                  UX for HODL Bot, TG-based delta-neutral trading tool
                </SectionBody>
              </div>
              <div>
                <h3 className="text-h3-em mb-1" style={subtitleStyle}>
                  Enso Hackathon - 1st Place (Sep 2025)
                </h3>
                <SectionBody>
                  UX/UI for Telegram Trading Bot
                </SectionBody>
              </div>
              <div>
                <h3 className="text-h3-em mb-1" style={subtitleStyle}>
                  ETH Seoul Hackathon - 1st Place (Worldcoin Track) (Jun 2023)
                </h3>
                <SectionBody>
                  UX for World Ticket NFT platform
                </SectionBody>
              </div>
              <div>
                <h3 className="text-h3-em mb-1" style={subtitleStyle}>
                  ETHCon Korea Hackathon - 5 Track Wins (Sep 2023)
                </h3>
                <SectionBody>
                  UI for Mooyaho, voice-based ZK wallet
                </SectionBody>
              </div>
              <div>
                <h3 className="text-h3-em mb-1" style={subtitleStyle}>
                  Seoul Web3 Festival - 2nd Place (Aug 2023)
                </h3>
                <SectionBody>
                  UX for That Voice, phishing prevention solution
                </SectionBody>
              </div>
            </div>
          </ContentSection>
        </div>
      </div>
    </section>
  );
};
