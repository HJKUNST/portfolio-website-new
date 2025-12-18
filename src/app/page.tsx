import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { BeliefFillTextSection } from "@/components/sections/BeliefFillTextSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { LookingForTeamSection } from "@/components/sections/LookingForTeamSection";
import { SharedCrafteryPathSection } from "@/components/sections/SharedCrafteryPathSection";
import { TeamsSection } from "@/components/sections/TeamsSection";
import { ValuesArrowFieldSection } from "@/components/sections/ValuesArrowFieldSection";
import { getPortfolioModel } from "@/lib/figma/get_figma_data";

export default async function Home() {
  const model = await getPortfolioModel();

  return (
    <>
      <SiteNav />
      <SmoothScrollProvider>
        <main className="flex min-h-screen flex-col gap-12 pt-16 pb-24">
          <HeroSection headline={model.hero.headline} tags={model.hero.tags} cards={model.hero.cards} />
          <TeamsSection headline={model.teamwork.headline} teams={model.teamwork.teams} />
          <BeliefFillTextSection headline={model.belief.headline} emphasis={model.belief.emphasis} />
          <SharedCrafteryPathSection steps={model.craftery.steps} />
          <ValuesArrowFieldSection title={model.offerings.title} items={model.offerings.items} />
          <LookingForTeamSection
            headline={model.cta.headline}
            subheadline={model.cta.subheadline}
            contactLabel={model.cta.contactLabel}
            icons={model.cta.icons}
          />
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
      <a className="text-h4-em" href="/">Laura HJ Kim</a>
      <nav className="hidden items-center gap-6 text-h4-em md:flex">
        <a href="#aboutme">About Me</a>
        <a href="#works">Works</a>
        <a href="#blog">Blog</a>
        <a href="#resume">Resume</a>
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
          <a href="https://github.com">Github</a>
          <a href="https://linkedin.com">LinkedIn</a>
          <a href="https://t.me">Telegram</a>
          <a href="mailto:hello@example.com">Email</a>
        </div>
      </div>
    </footer>
  );
};
