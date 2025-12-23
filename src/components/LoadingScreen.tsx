"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

// 로딩 시작: 배경 #0b0b0b, 텍스트 #fcfcfc
// 로딩 마무리: 배경 #fcfcfc, 텍스트 h3-em 색상
const INITIAL_BG = "#0b0b0b";
const FINAL_BG = "#fcfcfc";
const INITIAL_TEXT = "#fcfcfc";
const FINAL_TEXT = "#0b0b0b";
const RING_COLOR = "#8DC3C6";

export const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState(INITIAL_BG);
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const [textColor, setTextColor] = useState(INITIAL_TEXT);
  const isCompleteRef = useRef(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [showTextAnimation, setShowTextAnimation] = useState(false);

  useEffect(() => {
    const minLoadingTime = 800; // 한 사이클 시간 (ms) - 더 빠르게
    const cycleDuration = minLoadingTime / 1000; // 초 단위

    const checkPageLoaded = (): Promise<boolean> => {
      if (document.readyState === "complete") {
        return Promise.resolve(true);
      }
      return new Promise<boolean>((resolve) => {
        window.addEventListener("load", () => resolve(true), { once: true });
        setTimeout(() => resolve(true), minLoadingTime * 2); // 최소 2사이클 대기
      });
    };

    const gsap = getGSAP();
    let progressTween: gsap.core.Tween | null = null;
    let animationInterval: NodeJS.Timeout | null = null;

    // 로딩 애니메이션 시작 (0~100% 한 번만)
    const startLoadingAnimation = () => {
      if (gsap && !prefersReducedMotion()) {
        const progressObj = { value: 0 };
        const bgColorObj = { r: 11, g: 11, b: 11 }; // #0b0b0b

        // 배경색 애니메이션: #0b0b0b -> rgba(252,252,252,1) (먼저 불투명하게)
        const bgAlphaObj = { alpha: 1 };

        // 색상을 rgba(252,252,252,1)로 애니메이션 (alpha는 1로 유지)
        gsap.to(bgColorObj, {
          r: 252,
          g: 252,
          b: 252, // #fcfcfc
          duration: cycleDuration * 1.5, // 더 빠르게
          ease: "power2.out",
          onUpdate: () => {
            const bgColor = `rgba(${Math.round(bgColorObj.r)}, ${Math.round(bgColorObj.g)}, ${Math.round(bgColorObj.b)}, ${bgAlphaObj.alpha})`;
            setBackgroundColor(bgColor);
          },
        });

        // 텍스트 색상을 단순하게 #fcfcfc -> #0b0b0b 로 전환
        const textColorObj = { r: 252, g: 252, b: 252 }; // #fcfcfc
        const targetColor = { r: 11, g: 11, b: 11 }; // #0b0b0b

        gsap.to(textColorObj, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: cycleDuration * 0.5, // 빠르게 전환
          ease: "power2.out",
          onUpdate: () => {
            const r = Math.round(textColorObj.r);
            const g = Math.round(textColorObj.g);
            const b = Math.round(textColorObj.b);
            setTextColor(`rgb(${r}, ${g}, ${b})`);
          },
        });

        progressTween = gsap.to(progressObj, {
          value: 100,
          duration: cycleDuration * 1.5, // 1.5사이클 시간 동안 0~100% (더 빠르게)
          ease: "power2.out",
          onUpdate: () => {
            if (!isCompleteRef.current) {
              setProgress(Math.round(progressObj.value));
            }
          },
          // 100%에 도달하면 반복하지 않고 멈춤
        });
      } else {
        // GSAP이 없거나 reduced motion인 경우
        let currentProgress = 0;
        animationInterval = setInterval(() => {
          if (isCompleteRef.current) {
            if (animationInterval) clearInterval(animationInterval);
            return;
          }

          currentProgress += 2;
          if (currentProgress >= 100) {
            currentProgress = 100; // 100%에서 멈춤 (리셋하지 않음)
            if (animationInterval) clearInterval(animationInterval);
          }
          setProgress(currentProgress);
          // 텍스트 색상을 #fcfcfc -> #0b0b0b 로 선형 전환
          const ratio = currentProgress / 100;
          const r = Math.round(252 + (11 - 252) * ratio);
          const g = Math.round(252 + (11 - 252) * ratio);
          const b = Math.round(252 + (11 - 252) * ratio);
          setTextColor(`rgb(${r}, ${g}, ${b})`);
        }, (cycleDuration * 2 * 10) / 100); // 2사이클 시간 동안 100단계로 나누기
      }
    };

    // 텍스트 애니메이션 함수
    const startTextAnimation = () => {
      const gsap = getGSAP();
      if (!gsap || !textRef.current || prefersReducedMotion()) {
        setIsVisible(false);
        setTimeout(() => setIsLoading(false), 500);
        return;
      }

      // HeroSection의 headline 요소 찾기
      // HeroSection의 첫 번째 p 태그 (headline)
      const headlineElement = document.querySelector('section.section-shell p.text-h3-em') as HTMLElement;
      if (!headlineElement) {
        // 요소가 아직 렌더링되지 않았을 수 있으므로 약간의 delay 후 다시 시도
        setTimeout(() => {
          const retryElement = document.querySelector('section.section-shell p.text-h3-em') as HTMLElement;
          if (retryElement) {
            executeAnimation(retryElement);
          } else {
            setIsVisible(false);
            setTimeout(() => setIsLoading(false), 500);
          }
        }, 100);
        return;
      }

      executeAnimation(headlineElement);

      function executeAnimation(targetElement: HTMLElement) {
        const textElement = textRef.current;
        const localGsap = getGSAP();
        if (!textElement || !localGsap) {
          setIsVisible(false);
          setTimeout(() => setIsLoading(false), 500);
          return;
        }

        const targetRect = targetElement.getBoundingClientRect();

        // 원래 headline 텍스트 숨기기
        localGsap.set(targetElement, { opacity: 0 });

        setShowTextAnimation(true);

        // target 요소의 폰트 스타일 가져오기
        const targetStyles = window.getComputedStyle(targetElement);
        const targetFontFamily = targetStyles.fontFamily;
        const targetFontSize = targetStyles.fontSize;
        const targetFontWeight = targetStyles.fontWeight;
        const targetLetterSpacing = targetStyles.letterSpacing;

        // 텍스트를 목적지 위치에 바로 배치 (위에서 떨어지는 모션 제거)
        localGsap.set(textElement, {
          position: "fixed",
          left: targetRect.left,
          top: targetRect.top,
          margin: 0,
          zIndex: 10000,
          fontSize: targetFontSize,
          fontFamily: targetFontFamily,
          fontWeight: targetFontWeight,
          letterSpacing: targetLetterSpacing,
        });

        // 타임라인 생성
        const tl = localGsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            // target 요소에 gradient class 적용 (텍스트 깜박임 방지를 위해 먼저 설정)
            targetElement.textContent = "I Bake Interface until They're Ready to Serve";
            targetElement.classList.add("text-gradient-loading");
            targetElement.style.opacity = "1"; // 즉시 표시하여 깜박임 방지

            // 이동한 텍스트를 부드럽게 숨기기
            localGsap.to(textElement, {
              opacity: 0,
              duration: 0.2,
              ease: "power2.out",
            });

            // 배경은 이미 ScrambleText 시작 시 투명해졌으므로 로딩 화면만 숨김
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(() => setIsLoading(false), 100);
            }, 200);
          },
        });

        // 텍스트를 일반 색상으로 설정 (ScrambleText 애니메이션 중에는 gradient 제거)
        textElement.classList.remove("text-gradient-loading");
        localGsap.set(textElement, {
          color: "#0B0B0B", // gradient 대신 일반 색상 사용
          background: "none",
          WebkitBackgroundClip: "unset",
          WebkitTextFillColor: "unset",
          backgroundClip: "unset",
          opacity: 1, // 텍스트가 보이도록 확실히 설정
        });

        // ScrambleText로 변환 (타임라인에 추가하여 즉시 실행)
        tl.to(
          textElement,
          {
            scrambleText: {
              text: "I Bake Interface until They're Ready to Serve",
              chars: "lowerCase",
              speed: 0.8,
            },
            duration: 1.0,
            ease: "none",
            onStart: () => {
              // ScrambleText 시작 시 배경을 빠르게 투명하게 전환
              const bgAlphaObj = { alpha: 1 };
              localGsap.to(bgAlphaObj, {
                alpha: 0,
                duration: 0.3, // 빠르게 사라지게
                ease: "power2.out",
                onUpdate: () => {
                  setBackgroundColor(`rgba(252, 252, 252, ${bgAlphaObj.alpha})`);
                },
              });
            },
            onComplete: () => {
              // ScrambleText 완료 후 gradient 적용
              textElement.classList.add("text-gradient-loading");
              localGsap.set(textElement, {
                color: "transparent",
              });
            },
          },
          0 // 타임라인 시작 시점에 바로 실행
        );
      }
    };

    // 로딩 완료 처리
    Promise.all([
      checkPageLoaded(),
      new Promise((resolve) => setTimeout(resolve, minLoadingTime * 1.5)), // 최소 1.5사이클 (더 빠르게)
    ]).then(() => {
      isCompleteRef.current = true;
      // 현재 사이클을 완료하고 페이드 아웃
      if (progressTween) {
        progressTween.kill();
      }

      const gsap = getGSAP();
      const currentProgress = progress;
      const animationStartProgress = 85; // 85%에서 애니메이션 시작
      const finalProgress = { value: currentProgress };
      let animationStarted = false;

      if (gsap && !prefersReducedMotion()) {
        // 텍스트 색상을 최종색(#0b0b0b)으로 고정
        setTextColor(FINAL_TEXT);

        // 100%까지 진행하면서 85%에 도달하면 애니메이션 시작
        gsap.to(finalProgress, {
          value: 100,
          duration: 0.15, // 더 빠르게
          ease: "power2.out",
          onUpdate: () => {
            const p = Math.round(finalProgress.value);
            setProgress(p);
            // 85%에 도달하면 텍스트 애니메이션 시작 (더 빠른 느낌)
            if (p >= animationStartProgress && !animationStarted) {
              animationStarted = true;
              startTextAnimation();
            }
          },
        });
      } else {
        // 간단한 완료 처리
        setTextColor(FINAL_TEXT);
        setProgress(85);
        setTimeout(() => {
          startTextAnimation();
          setProgress(100);
        }, 100); // 더 빠르게
      }
    });

    startLoadingAnimation();

    return () => {
      isCompleteRef.current = true;
      if (progressTween) progressTween.kill();
      if (animationInterval) clearInterval(animationInterval);
    };
  }, []);


  if (!isLoading) return null;

  return (
    <>
      {/* 배경 및 로딩 이미지 */}
      <div
        ref={backgroundRef}
        className="fixed inset-0 z-[99999] flex items-center justify-center"
        style={{
          backgroundColor: backgroundColor,
          opacity: isVisible ? backgroundOpacity : 0,
          willChange: "opacity, background-color",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          {!showTextAnimation && progress < 100 && (
            <div className="flex items-center text-h3-em gap-3">
              <span
                className="font-semibold"
                style={{
                  letterSpacing: "-0.04em",
                  color: textColor,
                }}
              >
                Baking the Website
              </span>
              <span
                className="font-medium"
                style={{
                  color: textColor,
                  opacity: 0.6,
                }}
              >
                {progress}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 텍스트 애니메이션용 별도 컨테이너 (배경 밖) - 항상 렌더링하되 showTextAnimation일 때만 보이도록 */}
      <span
        ref={textRef}
        className="font-semibold fixed z-[10000]"
        style={{
          color: textColor,
          letterSpacing: "-0.04em",
          fontSize: "20px",
          display: showTextAnimation ? "block" : "none",
        }}
      >
        Baking the Website
      </span>
    </>
  );
};

