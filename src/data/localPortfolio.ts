import type { PortfolioFigmaModel } from "@/lib/figma/types";

export const localPortfolio: PortfolioFigmaModel = {
  hero: {
    headline: "I Bake Interface until They’re Ready to Serve",
    tags: [
      "Product Design",
      "UX/UI Design",
      "Intuitive User Experiences",
      "Blockchain UX",
      "Prototyping",
      "Design Systems",
      "User Research",
      "Product Strategy",
      "Data Visualization",
      "Analytics",
      "Product Design",
      "UX/UI D",
    ],
    cards: [
      {
        title: "EISEN Labs",
        subtitle: "Pump your profit potential",
        pill: "Defi / Mobile",
      },
      {
        title: "Graphic Design & Marketing",
        subtitle: "Works of Eisen Finance",
        pill: "Campaign",
      },
      {
        title: "Hyperliquid Portal",
        subtitle: "No unified path to trade",
        pill: "Web App",
      },
      {
        title: "Hedging the FX Market",
        subtitle: "KRW native stables to hedge FX risk",
        pill: "FX Stable",
      },
    ],
  },
  craftery: {
    steps: [
      "I design with the mindset of shared craftery,",
      "aiming for interfaces that hold together, convert cleanly,",
      "and age well because the work underneath is honest.",
    ],
  },
  offerings: {
    title: "Things that I can add values for you",
    items: [
      "User Interface (UI)",
      "Design System",
      "Pitch Deck",
      "UX Research",
      "Landing Page",
      "Brand Guideline",
      "Design Engineering",
      "Interaction Design",
      "More Coming Soon…",
    ],
  },
  teamwork: {
    headline:
      "Teams that I've made great outputs with — small teams working in rhythm.",
    teams: [
      {
        name: "EISEN Labs",
        detail: "Onchain arc & dex aggregator microinteractions.",
        image: "/1st.png",
      },
      {
        name: "HODL Bot",
        detail: "Brand & interaction patterns for bot experience.",
        image: "/2nd.png",
      },
      {
        name: "Product Summit",
        detail: "Storytelling decks for trading narratives.",
        image: "/3rd.png",
      },
      {
        name: "Studio",
        detail: "Design engineering and prototyping.",
        image: "/4th.png",
      },
    ],
  },
  cta: {
    headline:
      "I’m looking for a team that builds in that cadence. I bring the machinery, the craft, and the ability to help many hands align toward one clear product.",
    subheadline: "help many hands align toward one clear product.",
    contactLabel: "Contact Me",
    icons: [
      { href: "https://www.linkedin.com", label: "LinkedIn", icon: "in" },
      { href: "https://github.com", label: "Github", icon: "gh" },
      { href: "https://t.me", label: "Telegram", icon: "tg" },
      { href: "mailto:hello@example.com", label: "Email", icon: "mail" },
    ],
  },
};

