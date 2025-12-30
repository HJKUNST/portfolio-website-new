"use client";

import { useState, useEffect } from "react";

export const SiteFooter = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const footerText = "Physically based in Seoul, South Korea, but heart's in NYC, London, Hong Kong. Love making/ contemplating interface that sparks between variety.";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldTruncate = isMobile && !isExpanded;

  return (
    <footer 
      className="text-h4-em z-100 fixed bottom-0 left-0 right-0 flex items-center justify-center px-4 py-2 backdrop-blur"
      style={{
        background: "rgba(202, 202, 202, 0.2)",
      }}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between w-full">
        <span
          onClick={() => isMobile && setIsExpanded(!isExpanded)}
          className={`${isMobile ? "cursor-pointer" : "cursor-default"}`}
          style={{
            display: shouldTruncate ? "-webkit-box" : "block",
            WebkitLineClamp: shouldTruncate ? 1 : "none",
            WebkitBoxOrient: shouldTruncate ? "vertical" : "initial",
            overflow: shouldTruncate ? "hidden" : "visible",
            textOverflow: shouldTruncate ? "ellipsis" : "clip",
          }}
        >
          {footerText}
        </span>
        <div className="flex gap-4 text-h4-em [&>a]:leading-none [&>a:not(:first-child)]:border-sm [&>a:not(:first-child)]:pl-4 [&>a:not(:first-child)]:border-gray-400/60">
          <a href="https://github.com" className="hover:!text-[var(--secondary)] transition-colors">
            Github
          </a>
          <a href="https://linkedin.com" className="hover:!text-[var(--secondary)] transition-colors">
            LinkedIn
          </a>
          <a href="https://t.me" className="hover:!text-[var(--secondary)] transition-colors">
            Telegram
          </a>
          <a href="mailto:hello@example.com" className="hover:!text-[var(--secondary)] transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
};


