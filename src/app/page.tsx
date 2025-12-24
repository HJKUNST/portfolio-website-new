import Link from "next/link";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
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

const SiteNav = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-4 py-2 backdrop-blur"
      style={{
        background: "rgba(202, 202, 202, 0.2)",
      }}>
      <Link className="text-h4-em hover:!text-[var(--secondary)] transition-colors" href="/">Laura HJ Kim</Link>
      <nav className="hidden items-center gap-6 text-h4-em md:flex">
        <a href="#aboutme" className="hover:!text-[var(--secondary)] transition-colors">About Me</a>
        <a href="#works" className="hover:!text-[var(--secondary)] transition-colors">Works</a>
        <a href="#blog" className="hover:!text-[var(--secondary)] transition-colors">Blog</a>
        <a href="#resume" className="hover:!text-[var(--secondary)] transition-colors">Resume</a>
      </nav>
    </header>
  );
};

const SiteFooter = () => {
  return (
    <footer className="text-h4-em z-100 fixed bottom-0 left-0 right-0 flex items-center justify-center px-4 py-2 backdrop-blur"
      style={{
        background: "rgba(202, 202, 202, 0.2)",
      }}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between w-full">
        <span>
          Physically based on Seoul, South Korea, but heart’s in NYC, LDN, HK. Love making/
          contemplating interface that sparks between variety.
        </span>
        <div className="flex gap-4 text-h4-em [&>a]:leading-none [&>a:not(:first-child)]:border-sm [&>a:not(:first-child)]:pl-4 [&>a:not(:first-child)]:border-gray-400/60">
          <a href="https://github.com" className="hover:!text-[var(--secondary)] transition-colors">Github</a>
          <a href="https://linkedin.com" className="hover:!text-[var(--secondary)] transition-colors">LinkedIn</a>
          <a href="https://t.me" className="hover:!text-[var(--secondary)] transition-colors">Telegram</a>
          <a href="mailto:hello@example.com" className="hover:!text-[var(--secondary)] transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
};
