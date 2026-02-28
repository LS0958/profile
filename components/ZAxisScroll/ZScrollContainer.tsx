"use client";
import React, { useEffect } from "react";
import { useSpring } from "framer-motion";
import { useZScroll } from "@/hooks/useZScroll";
import { ZScrollProvider } from "./ZScrollContext";
import { useSound } from "@/hooks/useSound";

interface ZScrollContainerProps {
  children: React.ReactNode;
  sectionCount: number;
  overlay?: React.ReactNode;
}

export function ZScrollContainer({ children, sectionCount, overlay }: ZScrollContainerProps) {
  const scroll = useZScroll(sectionCount);
  const { playWhoosh } = useSound();

  /**
   * ONE shared spring: follows progressMV which is set instantly to the target
   * section index. The spring produces smoothMV used by all ZScrollSection
   * transforms. No synthetic scroller, no DOM scroll events, no RAF polling.
   */
  const smoothMV = useSpring(scroll.progressMV, {
    stiffness: 280,
    damping: 34,
    mass: 0.25,
    // Terminate the spring loop as soon as it's visually settled.
    // Without these, Framer Motion keeps ticking the RAF loop until the
    // value numerically reaches 0 (which can take extra frames).
    restDelta: 0.001,
    restSpeed: 0.001,
  });

  const prevIndex = React.useRef(0);
  useEffect(() => {
    if (prevIndex.current !== scroll.currentIndex) {
      playWhoosh();
      prevIndex.current = scroll.currentIndex;
    }
  }, [scroll.currentIndex, playWhoosh]);

  return (
    <ZScrollProvider value={{ ...scroll, smoothMV }}>
      {/* Fixed 3D perspective scene */}
      <div className="z-scene" aria-hidden="false">
        <div className="z-stage" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </div>

      {/* Fixed overlays (Header, CursorGlow) — inside provider context */}
      {overlay}
    </ZScrollProvider>
  );
}
