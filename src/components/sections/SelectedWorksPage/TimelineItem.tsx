"use client";

import { forwardRef } from "react";
import { WorkItem } from "@/lib/works/types";
import { BodyStyle } from "@/lib/works/constants";
import clsx from "clsx";

interface TimelineItemProps {
  work: WorkItem;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: (e: React.FocusEvent<HTMLDivElement>) => void;
}

const activeTitleStyle = {
  background: "var(--primary)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  fontFamily: "var(--font-manrope), Manrope, sans-serif",
  fontSize: "clamp(18px, 1.6vw, 20px)",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: "1.4em",
  opacity: 1,
  fontStyle: "underline",
};

const inactiveTitleStyle = {
  fontFamily: "var(--font-manrope), Manrope, sans-serif",
  fontSize: "clamp(18px, 1.6vw, 20px)",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  lineHeight: "1.4em",
  color: "var(--gray-900)",
  opacity: 1,
  transition: "opacity 0.3s ease",
};

const SectionBody = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={`text-em ${className}`} style={BodyStyle}>
    {children}
  </p>
);

export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ work, index, isActive, onClick, onMouseEnter, onMouseLeave, onFocus }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "cursor-pointer text-left",
          index === 0 && "pt-6"
        )}
        style={{ direction: "ltr" }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
      >
        <div className="flex gap-3 mb-1 items-start">
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
          <div className="flex items-center gap-2 flex-wrap">
            {work.link ? (
              <a
                href={work.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity inline-flex items-center focus:outline-none"
              >
                <h3
                  className="text-h3-em !font-medium !mb-0 inline-block transition-opacity duration-300"
                  style={isActive ? activeTitleStyle : inactiveTitleStyle}
                >
                  {work.title}
                </h3>
              </a>
            ) : (
              <h3
                className="text-h3-em !font-medium !mb-0 inline-block transition-opacity duration-300"
                style={isActive ? activeTitleStyle : inactiveTitleStyle}
              >
                {work.title}
              </h3>
            )}
            {(work.websiteLink || work.portfolioLink) && (
              <span className="text-em inline-flex items-center" style={{ ...BodyStyle, color: "var(--gray-300)" }}>
                |
              </span>
            )}
            {work.websiteLink && (
              <a
                href={work.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-em hover:opacity-80 transition-opacity inline-flex items-center focus:outline-none"
                style={{
                  ...BodyStyle,
                  color: "var(--gray-300)",
                  textDecoration: "underline",
                }}
              >
                Website
              </a>
            )}
            {work.websiteLink && work.portfolioLink && (
              <span className="text-em inline-flex items-center" style={{ ...BodyStyle, color: "var(--gray-300)" }}>
                |
              </span>
            )}
            {work.portfolioLink && (
              <a
                href={work.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-em hover:opacity-80 transition-opacity inline-flex items-center focus:outline-none"
                style={{
                  ...BodyStyle,
                  color: "var(--gray-300)",
                  textDecoration: "underline",
                }}
              >
                Portfolio
              </a>
            )}
          </div>
        </div>
        {work.description && (
          <SectionBody className="ml-[42px] whitespace-pre-line">
            {work.description}
          </SectionBody>
        )}
      </div>
    );
  }
);
TimelineItem.displayName = "TimelineItem";

