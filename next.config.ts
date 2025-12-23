import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow serving local SVGs through next/image (used for social icons)
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
};

export default nextConfig;
