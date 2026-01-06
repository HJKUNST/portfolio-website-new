"use client";

import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  isAtStart: boolean;
  isAtEnd: boolean;
};

export const CarouselNav = ({ onPrev, onNext, isAtStart, isAtEnd }: Props) => {
  const buttonBase = "flex items-center gap-2 px-4 py-2 rounded-2xl transition";
  const buttonActive = "bg-gray-100 hover:bg-gray-200";
  const buttonDisabled = "bg-gray-50 text-gray-300 cursor-not-allowed";

  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        className={clsx(buttonBase, isAtStart ? buttonDisabled : buttonActive)}
        onClick={onPrev}
        disabled={isAtStart}
        aria-label="Previous"
      >
        <ChevronLeftIcon aria-hidden />
      </button>
      <button
        className={clsx(buttonBase, isAtEnd ? buttonDisabled : buttonActive)}
        onClick={onNext}
        disabled={isAtEnd}
        aria-label="Next"
      >
        <ChevronRightIcon aria-hidden />
      </button>
    </div>
  );
};
