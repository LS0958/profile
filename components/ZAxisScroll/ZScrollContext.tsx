"use client";
import React, { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";
import type { ZScrollState } from "@/hooks/useZScroll";

interface ZScrollContextValue extends ZScrollState {
  /** Single shared spring—all sections consume this; no per-section springs needed. */
  smoothMV: MotionValue<number>;
}

const ZScrollContext = createContext<ZScrollContextValue | null>(null);

export function ZScrollProvider({
  value,
  children,
}: {
  value: ZScrollContextValue;
  children: React.ReactNode;
}) {
  return (
    <ZScrollContext.Provider value={value}>{children}</ZScrollContext.Provider>
  );
}

export function useZScrollContext() {
  const ctx = useContext(ZScrollContext);
  if (!ctx) throw new Error("useZScrollContext must be used inside ZScrollProvider");
  return ctx;
}
