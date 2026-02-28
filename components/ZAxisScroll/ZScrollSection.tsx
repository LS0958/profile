"use client";
import React, { useRef, useEffect } from "react";
import { motion, useTransform } from "framer-motion";
import { useZScrollContext } from "./ZScrollContext";

interface ZScrollSectionProps {
  index: number;
  children: React.ReactNode;
  id?: string;
}

export function ZScrollSection({ index, children, id }: ZScrollSectionProps) {
  const { smoothMV, currentIndex, totalSections, scrollToSection } = useZScrollContext();
  const innerRef = useRef<HTMLDivElement>(null);
  // Debounce: one Z-navigation per gesture (800ms covers trackpad momentum)
  const lastNavTime = useRef(0);
  // Dwell: timestamp when inner scroll first became exhausted in the current direction.
  // We require 500ms of continuous scrolling at the boundary before triggering Z-nav,
  // so users don’t accidentally jump sections just by reaching the bottom.
  const exhaustedAt = useRef(0);


  /* ── Transforms driven by the ONE shared spring ─────────────────────── */
  const diff = useTransform(smoothMV, (p) => index - p);

  const translateZ = useTransform(diff, (d) => {
    // Keep values well inside the perspective frustum (perspective: 1600px in CSS)
    // so elements stay visible throughout the full spring animation.
    // Future (d > 0): send backward.  Past (d < 0): push toward viewer.
    if (d > 0) return `${-900 * Math.min(d, 3)}px`;   // future: max -2700px behind camera
    return `${1200 * Math.min(Math.abs(d), 1.2)}px`;  // past: max 1440px — inside frustum at d=1
  });

  const scale = useTransform(diff, (d) => {
    if (d > 0) return Math.max(0.35, 1 - d * 0.20);
    return Math.min(1.45, 1 + Math.abs(d) * 0.25);
  });

  const opacity = useTransform(diff, (d) => {
    if (d >= 0) {
      if (d < 0.4) return 1;
      if (d < 1.5) return Math.max(0.15, 1 - (d - 0.4) / 1.1);
      return 0.08;
    } else {
      if (d > -0.08) return 1;
      if (d > -0.28) return Math.max(0, 1 - Math.abs(d + 0.08) / 0.20);
      return 0;
    }
  });

  /**
   * "none" (not "blur(0px)") for active section.
   * Any filter value — even blur(0px) — creates a CSS stacking context that
   * flattens preserve-3d on all descendants, breaking project card 3D flips.
   */
  const filter = useTransform(diff, (d) => {
    if (Math.abs(d) < 0.5) return "none";
    if (d > 0) return `blur(${Math.min(10, (d - 0.5) * 8)}px)`;
    return `blur(${Math.min(24, (Math.abs(d) - 0.5) * 40)}px)`;
  });

  /* ── Wheel routing ─────────────────────────────────────────────────── *
   *  1. Check the explicit innerRef overflow container.                  *
   *  2. If it has scroll room in the wheel direction → scroll it.        *
   *  3. If fully exhausted → call scrollToSection(currentIndex ± 1).    *
   *     800ms debounce prevents multi-fire from trackpad momentum.       *
   * ─────────────────────────────────────────────────────────────────── */
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const inner = innerRef.current;
    if (!inner) return;

    const canScrollDown = inner.scrollTop < inner.scrollHeight - inner.clientHeight - 1;
    const canScrollUp   = inner.scrollTop > 1;

    if (e.deltaY > 0 && canScrollDown) {
      inner.scrollTop += e.deltaY;
      exhaustedAt.current = 0; // still has content — reset dwell timer
      return;
    }
    if (e.deltaY < 0 && canScrollUp) {
      inner.scrollTop += e.deltaY;
      exhaustedAt.current = 0; // still has content — reset dwell timer
      return;
    }

    // Inner content is exhausted in this direction.
    // Start the dwell timer on first hit; only Z-navigate after 500ms.
    const now = Date.now();
    if (exhaustedAt.current === 0) {
      exhaustedAt.current = now;
      return; // first hit — give the user a moment to realise they’re at the edge
    }
    if (now - exhaustedAt.current < 500) return; // still within the dwell window

    // Dwell satisfied — Z-navigate with the standard debounce guard
    if (now - lastNavTime.current < 800) return;
    lastNavTime.current = now;
    exhaustedAt.current = 0;

    if (e.deltaY > 0 && currentIndex < totalSections - 1) {
      scrollToSection(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      scrollToSection(currentIndex - 1);
    }
  };

  /* ── Touch swipe routing ─────────────────────────────────────────────
   *
   * Two mobile-specific problems solved here:
   *
   * 1. PULL-TO-REFRESH: at scrollTop=0, a downward swipe triggers the
   *    browser's native pull-to-refresh, reloading the page instead of
   *    going to the previous section.
   *
   * 2. OVERSCROLL BOUNCE: at the bottom, iOS/Android shows an elastic
   *    bounce animation. This makes the page feel "done", and the bounce
   *    itself registers as scrolled > 8, so the next swipe never fires
   *    Z-navigation — requiring a second deliberate swipe.
   *
   * FIX: Add a direct addEventListener('touchmove', …, { passive: false })
   * on the inner div. This is the ONLY way to call e.preventDefault() on
   * mobile — React's synthetic onTouchMove is registered as passive in
   * Chromium/Safari and silently ignores preventDefault().
   * ──────────────────────────────────────────────────────────────────── */
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchStartScroll = useRef(0);
  // null = axis undecided; true = vertical; false = horizontal
  const isVerticalSwipe = useRef<boolean | null>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const onTouchMove = (e: TouchEvent) => {
      const dy = touchStartY.current - e.touches[0].clientY;
      const dx = touchStartX.current - e.touches[0].clientX;

      // Determine swipe axis on first significant movement
      if (isVerticalSwipe.current === null) {
        if (Math.abs(dy) < 5 && Math.abs(dx) < 5) return;
        isVerticalSwipe.current = Math.abs(dy) > Math.abs(dx);
      }
      if (!isVerticalSwipe.current) return;

      const atBottom = el.scrollTop >= el.scrollHeight - el.clientHeight - 1;
      const atTop = el.scrollTop <= 0;

      // Block overscroll bounce and pull-to-refresh at boundaries
      if ((dy > 0 && atBottom) || (dy < 0 && atTop)) {
        e.preventDefault();
      }
    };

    // { passive: false } is mandatory — the browser ignores preventDefault()
    // on passive listeners, which is the default for touchmove on Chrome/Safari.
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchStartScroll.current = innerRef.current?.scrollTop ?? 0;
    isVerticalSwipe.current = null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const delta = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(delta) < 50) return;          // ignore taps / micro-swipes
    if (isVerticalSwipe.current === false) return; // horizontal swipe — ignore

    const inner = innerRef.current;
    if (inner) {
      // If content actually scrolled during this gesture, respect that.
      const scrolled = Math.abs(inner.scrollTop - touchStartScroll.current);
      if (scrolled > 12) return;

      // Only Z-navigate from the correct boundary.
      const atBottom = inner.scrollTop >= inner.scrollHeight - inner.clientHeight - 1;
      const atTop = inner.scrollTop <= 0;
      if (delta > 0 && !atBottom) return; // swipe up but more content below
      if (delta < 0 && !atTop) return;    // swipe down but more content above
    }

    const now = Date.now();
    if (now - lastNavTime.current < 800) return;
    lastNavTime.current = now;

    if (delta > 0 && currentIndex < totalSections - 1) scrollToSection(currentIndex + 1);
    else if (delta < 0 && currentIndex > 0) scrollToSection(currentIndex - 1);
  };

  const isActive = index === currentIndex;

  return (
    <motion.div
      id={id}
      className="z-section"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        translateZ,
        scale,
        opacity,
        filter,
        transformStyle: "preserve-3d",
        zIndex: isActive ? 10 : Math.max(1, 8 - Math.abs(index - currentIndex) * 2),
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div
        ref={innerRef}
        className="w-full h-full overflow-y-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,245,255,0.3) transparent", touchAction: "pan-y", overscrollBehavior: "none" }}
      >
        {/* pt-20 clears the 64px fixed header (h-16) + 16px breathing room */}
        <div className="pt-20">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
