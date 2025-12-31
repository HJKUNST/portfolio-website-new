import type { Metadata } from "next";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AboutMeSection } from "@/components/sections/AboutMePage";

export const metadata: Metadata = {
  title: "About Me | Laura HJ Kim",
  description: "Product Designer at the intersection of design, engineering, and finance.",
  openGraph: {
    title: "About Me | Laura HJ Kim",
    description: "Product Designer at the intersection of design, engineering, and finance.",
    images: [
      {
        url: '/about-me-prev.png',
        width: 1200,
        height: 630,
        alt: 'Laura Heejoo Kim',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Me | Laura HJ Kim",
    description: "Product Designer at the intersection of design, engineering, and finance.",
    images: ['/about-me-prev.png'],
  },
};

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


