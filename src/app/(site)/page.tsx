import { HeroSection } from "@/features/home/HeroSection";
import { LookingForTeamSection } from "@/features/home/LookingForTeamSection";
import { SharedCrafteryPathSection } from "@/features/home/SharedCrafteryPathSection";
import { TeamsSection } from "@/features/home/TeamsSection";
import { ValuesArrowFieldSection } from "@/features/home/ValuesArrowFieldSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-12 pt-16 relative">
      <HeroSection />
      <TeamsSection />
      <SharedCrafteryPathSection />
      <ValuesArrowFieldSection />
      <LookingForTeamSection />
    </main>
  );
}
