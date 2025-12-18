export type FigmaPaint =
  | string
  | {
      type: "GRADIENT_LINEAR" | "GRADIENT_RADIAL";
      gradient: string;
    };

export type FigmaNode = {
  id: string;
  name: string;
  type: string;
  text?: string;
  fills?: FigmaPaint[];
  children?: FigmaNode[];
};

export type FigmaDocumentResponse = {
  nodes?: FigmaNode[];
  name?: string;
};

export type PortfolioCard = {
  title: string;
  subtitle?: string;
  image?: string;
  pill?: string;
};

export type PortfolioTeam = {
  name: string;
  detail: string;
  image?: string;
};

export type PortfolioFigmaModel = {
  hero: {
    headline: string;
    tags: string[];
    cards: PortfolioCard[];
  };
  belief: {
    headline: string;
    emphasis: string;
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

