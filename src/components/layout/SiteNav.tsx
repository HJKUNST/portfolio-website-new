"use client";

import Link from "next/link";

export const SiteNav = () => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-4 py-2 backdrop-blur"
      style={{
        background: "rgba(202, 202, 202, 0.2)",
      }}
    >
      <Link className="text-h4-em hover:!text-[var(--secondary)] transition-colors" href="/">
        Laura HJ Kim
      </Link>
      <nav className="hidden items-center gap-6 text-h4-em md:flex">
        <Link href="/about" className="hover:!text-[var(--secondary)] transition-colors">
          About Me
        </Link>
        <Link href="/works" className="hover:!text-[var(--secondary)] transition-colors">
          Works
        </Link>
        <a href="https://hjkunst.github.io/" className="hover:!text-[var(--secondary)] transition-colors">
          Blog
        </a>
        <a href="https://docsend.com/v/h2z52/laura_kim_productdesigner_detailed" target="_blank" className="hover:!text-[var(--secondary)] transition-colors">
          Resume
        </a>
      </nav>
    </header>
  );
};

