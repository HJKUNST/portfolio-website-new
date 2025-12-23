"use client";

import { useEffect, useState } from "react";
import { getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 최소 로딩 시간 (ms)
    const minLoadingTime = 1500;

    // 페이지 로드 완료 확인
    const checkPageLoaded = (): Promise<boolean> => {
      if (document.readyState === "complete") {
        return Promise.resolve(true);
      }
      return new Promise<boolean>((resolve) => {
        window.addEventListener("load", () => resolve(true), { once: true });
        // 최대 대기 시간
        setTimeout(() => resolve(true), minLoadingTime);
      });
    };

    // 진행률 애니메이션
    const gsap = getGSAP();
    let progressTween: gsap.core.Tween | null = null;

    if (gsap && !prefersReducedMotion()) {
      const progressObj = { value: 0 };
      progressTween = gsap.to(progressObj, {
        value: 100,
        duration: minLoadingTime / 1000,
        ease: "power2.out",
        onUpdate: () => {
          setProgress(Math.round(progressObj.value));
        },
      });
    } else {
      // GSAP이 없거나 reduced motion인 경우
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, minLoadingTime / 50);
    }

    // 페이지 로드 및 최소 로딩 시간 대기
    Promise.all([
      checkPageLoaded(),
      new Promise((resolve) => setTimeout(resolve, minLoadingTime)),
    ]).then(() => {
      // 페이드 아웃 시작
      setIsVisible(false);

      // 페이드 아웃 완료 후 DOM에서 제거
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // transition duration과 동일
    });

    return () => {
      if (progressTween) progressTween.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{
        backgroundColor: "rgba(141, 195, 198, 1)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease-out",
        willChange: "opacity",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* 로딩 인디케이터 */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          <div
            className="absolute inset-0 rounded-full border-4 border-white border-t-transparent"
            style={{
              transform: `rotate(${progress * 3.6}deg)`,
              transition: "transform 0.1s linear",
            }}
          />
        </div>

        {/* 진행률 텍스트 */}
        <div className="text-lg text-white font-medium tracking-wide">{progress}%</div>
      </div>
    </div>
  );
};

