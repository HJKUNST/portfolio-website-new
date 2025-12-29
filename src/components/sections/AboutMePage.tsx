"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { getGSAP, ScrollTrigger } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

const TitleStyle = {
  fontFamily: "var(--font-manrope), Manrope, sans-serif",
  fontSize: "clamp(28px, 3.5vw, 40px)",
  fontWeight: 500,
  letterSpacing: "-0.02em",
  lineHeight: "1.333em",
};

const BodyStyle = {
  color: "var(--gray-300)",
  lineHeight: "1.366em",
  fontSize: "clamp(14px, 1.6vw, 20px)",
};

const subtitleStyle = {
  fontFamily: "var(--font-manrope), Manrope, sans-serif",
  fontSize: "clamp(18px, 1.6vw, 20px)",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: "1.571em",
  background: "var(--main-gradient)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const AboutMeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!sectionRef.current) return;

    const gsap = getGSAP();
    if (!gsap || !ScrollTrigger) return;

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
      gsap.fromTo(
        ref,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-shell max-w-[1280px] mx-auto pb-24 px-5 md:px-10"
      style={{ background: "#FCFCFC", paddingTop: "160px", paddingBottom: "160px" }}
    >
      {/* Main Title */}
      <h1
        ref={titleRef}
        className="text-h1-gradient mb-16 md:ml-5"
        style={{
          fontFamily: "var(--font-manrope), Manrope, sans-serif",
          fontSize: "clamp(32px, 4vw, 48px)",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: "1.5em",
        }}
      >
        Laura Heejoo Kim
      </h1>

      {/* 1:1 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {/* Left Column: Photo + Hobbies */}
        <div className="flex flex-col gap-16">
          {/* Photo */}
          <div
            ref={(el) => {
              contentRefs.current[0] = el;
            }}
            className="relative w-[25vw] min-w-[24rem] aspect-[295/393]"
          >
            <Image
              src="/about-me-photo-1526fe.png"
              alt="Laura Heejoo Kim"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Hobbies Section */}
          <div
            ref={(el) => {
              contentRefs.current[5] = el;
            }}
          >
            <p
              className="text-em whitespace-pre-line"
              style={BodyStyle}
            >
              {`Hobbies
                Making New Stuffs such as - Anatomy Sketch, Pottery, Ballet, Savoring Performing Arts`}
            </p>
          </div>
        </div>

        {/* Right Column: About Me + Mindset + Software + Education */}
        <div className="flex flex-col gap-16">
          {/* About Me Content */}
          <div
            ref={(el) => {
              contentRefs.current[1] = el;
            }}
          >
            <h2
              className="text-h2 mb-4"
              style={TitleStyle}
            >
              About Me
            </h2>
            <p
              className="text-em"
              style={BodyStyle}
            >
              Hi, I'm Laura, a Product Designer working at the intersection of design, engineering, and finance. I specialize in taking complex trading logic and multi-chain systems and shaping them into interfaces that feel clear, trustworthy, and usable. My experience spans both on-chain and CEX trading products, system modeling, and data-informed iteration across web3 applications.
            </p>
          </div>

          {/* Mindset Section */}
          <div
            ref={(el) => {
              contentRefs.current[2] = el;
            }}
          >
            <h2
              className="text-h2 mb-8"
              style={TitleStyle}
            >
              Mindset
            </h2>

            <div className="space-y-8">
              {/* Mindset Item 1 */}
              <div>
                <h3
                  className="text-h3-em mb-3"
                  style={subtitleStyle}
                >
                  Team-Driven, Thinking in Systems
                </h3>
                <p
                  className="text-em"
                  style={BodyStyle}
                >
                  Design works best as a team sport. Start with shared goals, constraints, and system context—screens come later. Decisions stay grounded when product, engineering, and design move in the same frame.
                </p>
              </div>

              {/* Mindset Item 2 */}
              <div>
                <h3
                  className="text-h3-em mb-3"
                  style={subtitleStyle}
                >
                  Giving Shape to What's Not Yet Defined
                </h3>
                <p
                  className="text-em"
                  style={BodyStyle}
                >
                  Undefined, technically dense products are the fun ones. Information architecture, states, and edge cases come before UI. The work is about giving systems a shape people can recognize, use, and trust.
                </p>
              </div>

              {/* Mindset Item 3 */}
              <div>
                <h3
                  className="text-h3-em mb-3"
                  style={subtitleStyle}
                >
                  Build, Craft, and Refine with Rigor
                </h3>
                <p
                  className="text-em"
                  style={BodyStyle}
                >
                  Assumptions don't scale—data does. Analytics and dashboards guide iteration, not gut feeling. Technical architecture gets translated across interfaces, decks, and brand assets, keeping the story consistent from protocol to pixel.
                </p>
              </div>
            </div>
          </div>

          {/* Software Section */}
          <div
            ref={(el) => {
              contentRefs.current[3] = el;
            }}
          >
            <h2
              className="text-h2 mb-8"
              style={TitleStyle}
            >
              Software
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-[119px] md:mt-[62px]">
              <div>
                <p
                  className="text-em whitespace-pre-line"
                  style={BodyStyle}
                >
                  {`Figma
Framer
GA4
Lottie
Maze`}
                </p>
              </div>
              <div>
                <p
                  className="text-em whitespace-pre-line"
                  style={BodyStyle}
                >
                  {`Adobe Suite
Illustrator
XD
Photoshop
After Effect`}
                </p>
              </div>
              <div>
                <p
                  className="text-em whitespace-pre-line"
                  style={BodyStyle}
                >
                  {`Protopie
HTML5
CSS5
Javascript
Tailwind`}
                </p>
              </div>
              <div>
                <p
                  className="text-em whitespace-pre-line"
                  style={BodyStyle}
                >
                  {`Storybook
Git
Blender`}
                </p>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div
            ref={(el) => {
              contentRefs.current[4] = el;
            }}
          >
            <h2
              className="text-h2 mb-4"
              style={TitleStyle}
            >
              Education
            </h2>
            <p
              className="text-em whitespace-pre-line"
              style={BodyStyle}
            >
              {`Hongik University, Seoul, South Korea

B.A. in Art Theory & Business Administration (Double Major)

Relevant Coursework: Computational Thinking, Web Programming, Business Programming, Investment Theory, Art Criticism, Business Administration`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
