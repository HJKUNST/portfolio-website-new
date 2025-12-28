"use client";

import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { LookingForTeamSection } from "@/components/sections/LookingForTeamSection";
import { SharedCrafteryPathSection } from "@/components/sections/SharedCrafteryPathSection";
import { TeamsSection } from "@/components/sections/TeamsSection";
import { ValuesArrowFieldSection } from "@/components/sections/ValuesArrowFieldSection";

export default function Home() {
  return (
    <>
      <SiteNav />
      <SmoothScrollProvider>
        <main className="flex min-h-screen flex-col gap-12 pt-16 relative">
          <HeroSection />
          <TeamsSection />
          <SharedCrafteryPathSection />
          <ValuesArrowFieldSection />
          <LookingForTeamSection />
        </main>
      </SmoothScrollProvider>
      <SiteFooter />
    </>
  );
}
