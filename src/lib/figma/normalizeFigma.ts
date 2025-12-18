import type { PortfolioFigmaModel } from "./types";
import { localPortfolio } from "@/data/localPortfolio";

export const normalizeFigma = (): PortfolioFigmaModel => {
  // Figma input is intentionally ignored; we render from local static content only.
  return localPortfolio as PortfolioFigmaModel;
};

