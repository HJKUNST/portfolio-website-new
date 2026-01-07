"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export const SiteNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-100 backdrop-blur"
      style={{
        background: "rgba(202, 202, 202, 0.2)",
      }}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <Link className="text-h4-em hover:!text-[var(--secondary)] transition-colors" href="/">
          Laura HJ Kim
        </Link>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden text-h4-em hover:!text-[var(--secondary)] transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <nav className="hidden items-center gap-6 text-h4-em md:flex">
          <Link href="/about" className="hover:!text-[var(--secondary)] transition-colors">
            About Me
          </Link>
          <Link href="/works" className="hover:!text-[var(--secondary)] transition-colors">
            Works
          </Link>
          <a
            href="https://hjkunst.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative hover:!text-[var(--secondary)] transition-colors"
          >
            Blog
            <span className="tooltip">Opens in new tab</span>
          </a>
          <a
            href="https://docsend.com/v/h2z52/laura_kim_productdesigner_detailed"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative hover:!text-[var(--secondary)] transition-colors last-item"
          >
            Resume
            <span className="tooltip">Opens in new tab</span>
          </a>
        </nav>
      </div>
      {/* Mobile Navigation Menu */}
      <nav
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-end gap-4 px-4 pb-4 text-h4-em">
          <Link
            href="/about"
            className="hover:!text-[var(--secondary)] transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            About Me
          </Link>
          <Link
            href="/works"
            className="hover:!text-[var(--secondary)] transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            Works
          </Link>
          <a
            href="https://hjkunst.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:!text-[var(--secondary)] transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            Blog
          </a>
          <a
            href="https://docsend.com/v/h2z52/laura_kim_productdesigner_detailed"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:!text-[var(--secondary)] transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
};
