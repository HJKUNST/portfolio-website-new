"use client";

import { forwardRef, type ReactNode } from "react";
import { subtitleStyle } from "@/lib/works/constants";

interface SectionSubtitleProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SectionSubtitle = forwardRef<HTMLHeadingElement, SectionSubtitleProps>(
  ({ children, className = "", style = {} }, ref) => (
    <h3 ref={ref} className={`text-h3-em mb-3 ${className}`} style={{ ...subtitleStyle, ...style }}>
      {children}
    </h3>
  )
);
SectionSubtitle.displayName = "SectionSubtitle";
