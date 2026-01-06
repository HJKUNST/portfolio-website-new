export type PortfolioCard = {
  title: string;
  subtitle?: string;
  image?: string;
  pill?: string;
  tags?: string[];
};

export type PortfolioTeam = {
  name: string;
  detail?: string;
  image?: string;
  surfaces?: string[];
  industry?: string;
  description?: string;
};

export type PortfolioFigmaModel = {
  hero: {
    headline: string;
    tags: string[];
    cards: PortfolioCard[];
  };
  craftery: {
    steps: string[];
  };
  offerings: {
    title: string;
    items: string[];
  };
  teamwork: {
    headline: string;
    teams: PortfolioTeam[];
  };
  cta: {
    headline: string;
    subheadline: string;
    contactLabel: string;
    icons: { href: string; label: string; icon: string }[];
  };
};
