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
  detail?: string;        // 선택사항으로 변경
  image?: string;
  // 다이얼로그에 표시될 상세 정보
  surfaces?: string[];    // 예: ["Mobile App", "Web Dashboard"]
  industry?: string;      // 예: "DeFi / Crypto"
  description?: string;   // 상세 설명
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

