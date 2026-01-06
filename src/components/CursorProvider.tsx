"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { CustomCursor } from "@/components/CustomCursor";

export const CursorProvider = () => {
  const pathname = usePathname();

  // 메인 페이지: 기존 설정 유지
  const hoverSelectors = useMemo(() => {
    return [".card-shell", "[data-cursor-hover]", "[data-cursor-focus]", "a", "button"];
  }, []);

  // mix-blend-difference 항상 활성화
  const useBlendDifference = true;

  return (
    <CustomCursor
      hoverSelectors={hoverSelectors}
      useBlendDifference={useBlendDifference}
      pathname={pathname}
    />
  );
};
