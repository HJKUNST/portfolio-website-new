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
