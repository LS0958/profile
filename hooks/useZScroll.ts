"use client";
import { useCallback, useState } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

export interface ZScrollState {
  currentIndex: number;
  totalSections: number;
  scrollToSection: (index: number) => void;
  /** MotionValue holding the target section index (0…N-1).
   *  Updated instantly — the spring in ZScrollContainer provides visual smoothness. */
  progressMV: MotionValue<number>;
}

export function useZScroll(totalSections: number): ZScrollState {
  const progressMV = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToSection = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(totalSections - 1, index));
      progressMV.set(clamped);   // instant → spring animates visually
      setCurrentIndex(clamped);  // React state → header highlight, wheel logic
    },
    [totalSections, progressMV]
  );

  return { currentIndex, scrollToSection, totalSections, progressMV };
}
