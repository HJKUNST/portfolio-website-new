import "server-only";

import { localPortfolio } from "@/data/localPortfolio";
import type { PortfolioFigmaModel } from "./types";

/**
 * Returns static local portfolio data so the site runs fully offline.
 * No FIGMA_TOKEN or network calls are used; env values are ignored.
 */
export const getPortfolioModel = async (): Promise<PortfolioFigmaModel> => {
  return localPortfolio;
};

