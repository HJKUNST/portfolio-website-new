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
        image: "/1st.png",
        surfaces: ["DAPP"],
        industry: "DeFi",
        description: `Eisen is a multichain DEX aggregator on 20+ chains, expanding with V2 to support both CEX and DEX trading, including spot and derivatives.

        Worked as a solo designer / marketer in the tech-focused defi startup, building every visual materials from zero to one including the dapp experience, landing page which had resulted product growth from $10K to $10M Daily.`,
      },
      {
        name: "HODL Bot",
        image: "/2nd.png",
        surfaces: ["Telegram Bot"],
        industry: "DeFi",
        description: `A Telegram-based trading assistant built on Hyperliquid, designed to unify Spot, Perp, and EVM trading into a single delta-neutral strategy interface. The bot automates hedging and funding-fee arbitrage, helping users reduce downside risk while capturing extra yield — all within a simple chat-based UX.

        I led the UX and deck direction for the project, redesigning trading and balance flows to make multi-venue execution seamless. My work reduced task completion time by 43% and user errors by 35%, while improving overall clarity in the trading flow. I also organized and designed the full pitch deck narrative and visual system, which contributed to the team winning 3rd Place ($6K) at the Hyperliquid Hackathon.`,
      },
      {
        name: "TGIF : FX Hedge with Stablecoins",
        image: "/3rd.png",
        surfaces: ["DAPP"],
        industry: "DeFi",
        description: `TGIF is an FX hedging protocol built on a KRW-native stablecoin concept, developed by a technically strong team exploring how on-chain systems can replace slow, bank-centric currency risk management for merchants and enterprises.

        I led the product narrative and UX, structuring the entire deck and translating complex FX hedging logic into clear user flows. My work focused on making the protocol's mechanisms understandable, usable, and trustworthy, contributing to a 2nd Place ($12K) finish.`,
      },
      {
        name: "Be My Next Teammates!",
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

