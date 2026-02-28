"use client";
import { useState, useEffect, useRef } from "react";
import { useZScrollContext } from "@/components/ZAxisScroll/ZScrollContext";

/**
 * Returns a numeric key that increments every time the section at `index`
 * becomes the active (front-most) section.
 *
 * Usage:
 *   const animKey = useSectionAnimKey(2);
 *   return <div key={animKey} ...> — all motion children inside will replay
 *          their initial→animate transitions on every visit.
 *
 * The initial active section (index 0) starts at key=1 so its animations
 * run on the very first paint without needing a navigation event.
 */
export function useSectionAnimKey(index: number): number {
  const { currentIndex } = useZScrollContext();
  // Section 0 starts active — give it key=1 so animations play immediately.
  const [animKey, setAnimKey] = useState(index === 0 ? 1 : 0);
  const prevActive = useRef(index === 0);

  useEffect(() => {
    const nowActive = currentIndex === index;
    if (nowActive && !prevActive.current) {
      setAnimKey((k) => k + 1);
    }
    prevActive.current = nowActive;
  }, [currentIndex, index]);

  return animKey;
}
