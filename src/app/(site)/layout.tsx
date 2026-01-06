import type { ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

type Props = {
  children: ReactNode;
};

export default function SiteLayout({ children }: Props) {
  return (
    <>
      <SiteNav />
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
      <SiteFooter />
    </>
  );
}
