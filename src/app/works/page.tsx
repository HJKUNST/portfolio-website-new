"use client";

import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SelectedWorksSection } from "@/components/sections/SelectedWorksPage";

export default function WorksPage() {
  return (
    <>
      <SiteNav />
      <SmoothScrollProvider>
        <main className="flex min-h-screen flex-col relative">
          <SelectedWorksSection />
        </main>
      </SmoothScrollProvider>
      <SiteFooter />
    </>
  );
}


