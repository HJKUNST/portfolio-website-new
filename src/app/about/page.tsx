"use client";

import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AboutMeSection } from "@/components/sections/AboutMeSection";

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <SmoothScrollProvider>
        <main className="flex min-h-screen flex-col relative">
          <AboutMeSection />
        </main>
      </SmoothScrollProvider>
      <SiteFooter />
    </>
  );
}

