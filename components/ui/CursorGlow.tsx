"use client";
import { useEffect, useRef } from "react";

/**
 * Pure DOM cursor — no Framer Motion, no React state, no RAF.
 * The mousemove handler mutates style.transform directly, giving exactly
 * the same latency as the browser's native cursor rendering.
 */
export function CursorGlow() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const t = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (dotRef.current)  dotRef.current.style.transform  = t;
      if (ringRef.current) ringRef.current.style.transform = t;
      if (glowRef.current) glowRef.current.style.transform = t;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Dot: 8px solid cyan circle, centered via left:-4px top:-4px offset */}
      <div ref={dotRef} className="cursor-dot" />
      {/* Ring: 36px outline circle, centered via left:-18px top:-18px offset */}
      <div ref={ringRef} className="cursor-ring" />
      {/* Ambient glow orb */}
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          left: -140,
          top: -140,
          width: 280,
          height: 280,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99990,
          background: "radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
