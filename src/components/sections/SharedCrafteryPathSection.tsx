"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ScrollTrigger, getGSAP } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/constants";

type Props = {
  steps: string[];
};

export const SharedCrafteryPathSection = ({ steps }: Props) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const gsap = getGSAP();
    if (!gsap || !ScrollTrigger || prefersReducedMotion()) return;
    if (!pathRef.current || !containerRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const offset = length * (1 - progress);
        gsap.to(path, { strokeDashoffset: offset, duration: 0.1, ease: "none" });

        if (progress < 0.3) setActiveIndex(0);
        else if (progress < 0.6) setActiveIndex(1);
        else setActiveIndex(2);
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section ref={containerRef} className="relative section-shell overflow-hidden">
      <div className="absolute inset-0 opacity-75">
        <svg viewBox="0 0 936 671" className="h-full w-full">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#85ADAF" />
              <stop offset="50%" stopColor="#0B0B0B" />
              <stop offset="100%" stopColor="#97B29D" />
            </linearGradient>
          </defs>
          <path
            id="stroke-path"
            ref={pathRef}
            d="M116.226 6.76259C117.752 5.16496 117.694 2.63297 116.096 1.10723C114.498 -0.418503 111.966 -0.36022 110.441 1.23741L113.333 4L116.226 6.76259ZM697.541 660.914C697.218 663.099 698.727 665.133 700.912 665.457L736.524 670.73C738.709 671.053 740.743 669.544 741.067 667.359C741.39 665.173 739.881 663.14 737.696 662.816L706.041 658.129L710.728 626.474C711.051 624.289 709.542 622.255 707.357 621.931C705.172 621.608 703.138 623.117 702.814 625.302L697.541 660.914ZM113.333 4L110.441 1.23741C6.95056 109.604 -14.2913 243.618 8.00249 349.487C19.1443 402.398 41.1945 448.454 69.4769 480.833C97.7385 513.188 132.562 532.218 169.077 529.993L168.834 526L168.59 522.007C135.355 524.033 102.748 506.762 75.5021 475.57C48.2775 444.403 26.7445 399.666 15.8308 347.839C-5.98635 244.233 14.7722 112.997 116.226 6.76259L113.333 4ZM168.834 526L169.077 529.993C187.586 528.865 208.265 519.362 230.484 504.632C252.787 489.845 277.103 469.474 302.947 446C328.8 422.519 356.321 395.806 384.991 368.32C413.686 340.81 443.565 312.494 474.235 285.7C535.646 232.05 599.895 184.806 663.682 162.391C727.224 140.062 790.107 142.409 849.575 187.683L851.998 184.5L854.421 181.317C792.389 134.091 726.565 131.814 661.029 154.844C595.738 177.788 530.54 225.888 468.972 279.675C438.153 306.6 408.16 335.026 379.455 362.545C350.725 390.088 323.318 416.692 297.569 440.078C271.812 463.472 247.853 483.518 226.063 497.964C204.189 512.466 184.957 521.01 168.59 522.007L168.834 526ZM851.998 184.5L849.575 187.683C909.363 233.2 929.649 284.91 927.003 336.875C924.34 389.162 898.426 442.259 864.607 490.065C830.835 537.806 789.466 579.871 756.486 610.033C740.007 625.104 725.646 637.181 715.411 645.486C710.294 649.638 706.21 652.845 703.41 655.012C702.01 656.095 700.931 656.918 700.205 657.468C699.842 657.743 699.566 657.95 699.383 658.087C699.292 658.155 699.223 658.207 699.178 658.24C699.156 658.257 699.139 658.269 699.129 658.277C699.123 658.281 699.12 658.284 699.117 658.286C699.115 658.287 699.114 658.288 701.498 661.5C703.882 664.712 703.884 664.71 703.888 664.707C703.891 664.705 703.897 664.701 703.903 664.696C703.917 664.686 703.936 664.672 703.961 664.653C704.011 664.616 704.085 664.561 704.181 664.488C704.375 664.344 704.66 664.129 705.034 663.846C705.782 663.279 706.883 662.44 708.306 661.339C711.151 659.138 715.284 655.892 720.452 651.698C730.788 643.311 745.271 631.131 761.885 615.936C795.092 585.567 836.911 543.069 871.138 494.685C905.32 446.366 932.218 391.775 934.993 337.281C937.784 282.465 916.133 228.3 854.421 181.317L851.998 184.5Z"
            fill="none"
            stroke="url(#grad)"
            strokeWidth={8}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative grid gap-3 md:grid-cols-3">
        {steps.map((line, idx) => (
          <div
            key={line}
            className={clsx(
              "card-surface bg-white/75 p-6 backdrop-blur transition-all duration-300",
              idx === activeIndex ? "shadow-2xl" : "opacity-75",
            )}
          >
            <p className="text-h2 text-left leading-snug">{line}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

